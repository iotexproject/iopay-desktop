import { Account } from 'iotex-antenna/lib/account/account';
import { ITokenInfo } from '../interfaces/wallet.interface';
import BigNumber from 'bignumber.js';
import { toETHAddress } from './address';
export const generateMessage = (nonce: string, account: Account, token: ITokenInfo): string => {
  if (!nonce || !account || !token) {
    return "";
  }
  const nonceStr = new BigNumber(nonce, 10).toString(10);
  return `${nonceStr}I authorize ${toETHAddress(
    account.address
  )} to claim in ${toETHAddress(token.tokenAddress)}`;
}
