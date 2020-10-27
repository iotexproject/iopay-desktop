import { FormInstance } from 'antd/lib/form/Form';
import BigNumber from 'bignumber.js';
import { Account } from 'iotex-antenna/lib/account/account';
import { PrivateKey } from 'iotex-antenna/lib/account/wallet';
import { IRPCProvider } from './rpc-provider.interface';

export interface UnlockComponentProps {
}
export interface IUnlockByKeyStore {
  form: FormInstance<IUnlockFormFields>;
}


export interface ITokenInfo {
  tokenAddress: string;
  balance: BigNumber;
  decimals: BigNumber;
  symbol: string;
  name: string;
  balanceString: string;
}

export interface ITokenInfoDict {
  [index: string]: ITokenInfo;
}

export interface IWalletState {
  account?: Account;
  hideExport?: boolean;
  network?: IRPCProvider;
  customRPCs: IRPCProvider[];
  tokens: ITokenInfoDict;
  defaultNetworkTokens: Array<string>;
  lockAt?: number; // milliseconds to lock wallet. 0: never lock. 1: never to reset it;
  isLockDelayed?: boolean;
  showUnlockModal?: boolean;
}
export interface IUnlockFormFields {
  keystore: PrivateKey;
  password: string;
}

export interface IPasswordFormInputProp {
  setFormFiled: (obj: Partial<IUnlockFormFields>) => void;
  initialValue?: string;
  checkWeakPassword?: boolean;
}

export interface UnlockByLedgerState {
  priKey: string;
  errorMessage: string;
  isPending: boolean;
}
