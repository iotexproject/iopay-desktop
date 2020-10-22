import BigNumber from "bignumber.js";
import { Account } from "iotex-antenna/lib/account/account";

export interface DecodeData {
  method: string;
  data: Record<string, unknown>;
}

export interface IERC20 {
  address: string;

  name(callerAddress: string): Promise<string>;

  symbol(callerAddress: string): Promise<string>;

  decimals(callerAddress: string): Promise<BigNumber>;

  totalSupply(callerAddress: string): Promise<BigNumber>;

  balanceOf(owner: string, callerAddress: string): Promise<BigNumber>;

  transfer(
    to: string,
    value: BigNumber,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ): Promise<string>;

  allowance(
    owner: string,
    spender: string,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ): Promise<string>;

  approve(
    spender: string,
    value: BigNumber,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ): Promise<string>;

  transferFrom(
    from: string,
    to: string,
    value: BigNumber,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ): Promise<string>;

  decode(data: string): DecodeData;
}
