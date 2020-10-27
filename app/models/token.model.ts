import BigNumber from "bignumber.js";
import { Account } from 'iotex-antenna/lib/account/account';
import { toRau } from "iotex-antenna/lib/account/utils";
import { DecodeData } from "iotex-antenna/lib/contract/contract";
import { BID_ABI } from "../constants/abi";
import { IAuthorizedMessage } from "../interfaces/authorized-message.interface";
import { IGasEstimation } from "../interfaces/gas-estimation.interface";
import { ITokenInfo } from "../interfaces/wallet.interface";
import { toIoTeXAddress } from "../utils/address";
import { getAntenna } from "../utils/get-antenna";
import { getNonce } from "../utils/get-nonce";
import { ERC20 } from "./erc20.model";
import { Vita } from "./vita.model";
import { XConfKeys } from './xconf.enum';

const vitaTokens = [
  "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw", // VITA Production
  "io14j96vg9pkx28htpgt2jx0tf3v9etpg4j9h384m" // VITA Testnet
];

export class Token {
  protected readonly api: ERC20 | Vita;
  protected static readonly tokenRefs: { [index: string]: Token } = {};
  protected isBidToken: boolean = false;

  constructor(api: ERC20 | Vita) {
    this.api = api;
  }

  public isVita(): boolean {
    return this.api instanceof Vita;
  }

  public static getToken(tokenAddress: string): Token {

    if (Token.tokenRefs[tokenAddress]) {
      return Token.tokenRefs[tokenAddress];
    }
    const isVita = (vitaTokens || []).indexOf(tokenAddress) >= 0;
    const clazz = new (isVita ? Vita : ERC20);
    const api = clazz.create(tokenAddress, getAntenna().iotx);
    const token = new Token(api);
    Token.tokenRefs[tokenAddress] = token;
    return token;
  }

  public static getVitaToken(
    tokenAddresses: Array<string>
  ): string | undefined {
    return tokenAddresses.find(tokenAddress =>
      vitaTokens.includes(tokenAddress)
    );
  }

  public getApi(): ERC20 | Vita {
    return this.api;
  }

  public static getBiddingToken(tokenAddress: string): Token {
    if (
      Token.tokenRefs[tokenAddress] &&
      Token.tokenRefs[tokenAddress].isBidToken
    ) {
      return Token.tokenRefs[tokenAddress];
    }
    const erc20 = new ERC20();
    const api = erc20.create(tokenAddress, getAntenna().iotx, BID_ABI);
    const token = new Token(api);
    token.isBidToken = true;
    Token.tokenRefs[tokenAddress] = token;
    return token;
  }

  public decode(data: string): DecodeData {
    return this.api.decode(data);
  }

  public async checkValid(): Promise<boolean> {
    try {
      const { symbol } = await this.getBasicTokenInfo();
      return `${symbol}`.length > 0;
    } catch (error) {
      return false;
    }
  }

  public async claimableAmount(walletAddress: string): Promise<BigNumber> {
    if (this.api instanceof Vita) {
      return this.api.claimableAmount(walletAddress, walletAddress);
    }
    throw new Error(`Token ${this.api.address} is not Vita!`);
  }

  public async getInfo(walletAddress: string): Promise<ITokenInfo> {
    const api = this.api;
    const [balance, name, symbol, decimals] = await Promise.all<
      BigNumber,
      string,
      string,
      BigNumber
    >([
      api.balanceOf(walletAddress, walletAddress),
      api.name(walletAddress),
      api.symbol(walletAddress),
      api.decimals(walletAddress)
    ]);
    const balanceString = balance
      .dividedBy(new BigNumber(`1e${decimals.toNumber()}`))
      .toString(10);

    return {
      tokenAddress: this.api.address,
      balance,
      decimals,
      symbol,
      name,
      balanceString
    };
  }

  public async getBasicTokenInfo() {
    const api = this.api;
    let cache;
    const _tbi = localStorage.getItem(XConfKeys.TOKENS_BASIC_INFOS)
    if (_tbi) {
      cache = JSON.parse(_tbi);
    }
    if (!cache[api.address]) {
      const [name, symbol, decimals] = await Promise.all([
        api.name(api.address),
        api.symbol(api.address),
        api.decimals(api.address)
      ]);
      cache[api.address] = {
        tokenAddress: this.api.address,
        decimals,
        symbol,
        name
      };
      localStorage.setItem(XConfKeys.TOKENS_BASIC_INFOS, JSON.stringify(cache));
    }
    return cache[api.address];
  }

  public async transfer(
    to: string,
    value: BigNumber,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ): Promise<string> {
    return this.api.transfer(to, value, account, gasPrice, gasLimit);
  }

  public async claim(account: Account): Promise<string> {
    if (this.api instanceof Vita) {
      return this.api.claim(account);
    }
    throw new Error(`Token ${this.api.address} is not Vita!`);
  }

  public async estimateClaimGas(account: Account): Promise<IGasEstimation> {
    if (this.api instanceof Vita) {
      return this.api.estimateClaimGas(account);
    }
    throw new Error(`Token ${this.api.address} is not Vita!`);
  }

  public async claimAs(
    authMessage: IAuthorizedMessage,
    account: Account
  ): Promise<string> {
    if (this.api instanceof Vita) {
      const { address, msg, sig } = authMessage;
      const nonce = getNonce(msg, this.api.address.toLowerCase());
      return this.api.claimAs(toIoTeXAddress(address), sig, nonce, account);
    }
    throw new Error(`Token ${this.api.address} is not Vita!`);
  }

  public async estimateClaimAsGas(
    authMessage: IAuthorizedMessage,
    account: Account
  ): Promise<IGasEstimation> {
    if (this.api instanceof Vita) {
      const { address, msg, sig } = authMessage;
      const nonce = getNonce(msg, this.api.address.toLowerCase());
      return this.api.estimateClaimAsGas(
        toIoTeXAddress(address),
        sig,
        nonce,
        account
      );
    }
    throw new Error(`Token ${this.api.address} is not Vita!`);
  }

  public async bid(account: Account, amount: string): Promise<string> {
    if (!this.isBidToken) {
      throw new Error(`Invalid bid token!`);
    }
    const amountRau = toRau(amount, "Iotx");
    const { gasLimit, gasPrice } = await this.estimateBidGas(
      account,
      amountRau
    );
    return this.api.executeMethod(
      "bid",
      account,
      gasPrice,
      gasLimit,
      amountRau
    );
  }

  public async estimateBidGas(
    account: Account,
    amount: string
  ): Promise<IGasEstimation> {
    if (!this.isBidToken) {
      throw new Error(`Invalid bid token!`);
    }
    return this.api.estimateExecutionGas("bid", account, amount);
  }

  public async estimateMaxBidAmount(account: Account): Promise<string> {
    const { accountMeta } = await getAntenna().iotx.getAccount({
      address: account.address
    });
    if (!accountMeta) {
      return "0";
    }
    const { gasLimit, gasPrice } = await this.api.estimateExecutionGas(
      "bid",
      account,
      accountMeta.balance
    );
    const gasNeeded = new BigNumber(gasLimit).multipliedBy(
      new BigNumber(gasPrice)
    );
    return new BigNumber(accountMeta.balance)
      .plus(gasNeeded.negated())
      .toString();
  }
}
