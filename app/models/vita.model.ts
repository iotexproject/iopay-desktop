import BigNumber from "bignumber.js";
import { Account } from 'iotex-antenna/lib/account/account';
import { IGasEstimation } from "../interfaces/gas-estimation.interface";
import { IVita } from "../interfaces/vita.interface";
import { ERC20 } from "./erc20.model";
import { hexToBytes } from "iotex-antenna/lib/account/utils";
import { IRpcMethod } from "iotex-antenna/lib/rpc-method/types";
import { Contract } from "iotex-antenna/lib/contract/contract";
import { ABI } from "../constants/abi";
import { getArgTypes, getHeaderHash } from "iotex-antenna/lib/contract/abi-to-byte";

export class Vita extends ERC20 implements IVita {
  public async claim(account: Account): Promise<string> {
    const { gasLimit, gasPrice } = await this.estimateClaimGas(account);
    return this.executeMethod("claim", account, gasPrice, gasLimit, "0");
  }

  public async estimateClaimGas(account: Account): Promise<IGasEstimation> {
    return this.estimateExecutionGas("claim", account, "0");
  }

  public async estimateClaimAsGas(
    owner: string,
    signature: string,
    nonce: BigNumber,
    account: Account
  ): Promise<IGasEstimation> {
    return this.estimateExecutionGas(
      "claimAs",
      account,
      "0",
      owner,
      hexToBytes(signature),
      nonce.toString()
    );
  }

  public async claimAs(
    owner: string,
    signature: string,
    nonce: BigNumber,
    account: Account
  ): Promise<string> {
    const { gasLimit, gasPrice } = await this.estimateClaimAsGas(
      owner,
      signature,
      nonce,
      account
    );
    return this.executeMethod(
      "claimAs",
      account,
      gasPrice,
      gasLimit,
      "0",
      owner,
      hexToBytes(signature),
      nonce.toString()
    );
  }

  public async claimableAmount(
    owner: string,
    callerAddress: string
  ): Promise<BigNumber> {
    const result = await this.readMethod(
      "claimableAmount",
      callerAddress,
      owner
    );
    return new BigNumber(result, 16);
  }

  public create(address: string, provider: IRpcMethod): Vita {
    const vita = new Vita();
    vita.address = address;
    vita.provider = provider;
    vita.contract = new Contract(ABI, address, {
      provider: provider,
      // @ts-ignore
      signer: provider.signer
    });

    const methods = {};
    // @ts-ignore
    for (const fnName of Object.keys(vita.contract.getABI())) {
      // @ts-ignore
      const fnAbi = vita.contract.getABI()[fnName];
      if (fnAbi.type === "constructor") {
        continue;
      }

      const args = getArgTypes(fnAbi);
      const header = getHeaderHash(fnAbi, args);

      // @ts-ignore
      methods[header] = {
        name: fnName,
        inputsNames: args.map(i => {
          return `${i.name}`;
        }),
        inputsTypes: args.map(i => {
          return `${i.type}`;
        })
      };
    }
    vita.methods = methods;

    return vita;
  }
}
