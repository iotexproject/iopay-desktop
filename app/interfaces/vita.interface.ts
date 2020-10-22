import BigNumber from 'bignumber.js';
import { IERC20 } from './erc20.interface';

export interface IVita extends IERC20 {
  claim(account: Account, gasPrice: string, gasLimit: string): Promise<string>;
  claimAs(
    owner: string,
    signature: string,
    nonce: BigNumber,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ): Promise<string>;
  claimableAmount(owner: string, callerAddress: string): Promise<BigNumber>;
}
