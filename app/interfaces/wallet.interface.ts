import { FormInstance } from 'antd/lib/form/Form';
import BigNumber from 'bignumber.js';

export interface UnlockComponentProps {
  chainId: number;
  setCreateNew: (param?: unknown) => unknown;
}
export interface IUnlockByKeyStore {
  form: FormInstance<{ password: string; keystore: Record<string, string> }>;
}

export interface IRPCProvider {
  name: string;
  url: string;
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
  customRPCs: Array<IRPCProvider>;
  tokens: ITokenInfoDict;
  defaultNetworkTokens: Array<string>;
  lockAt?: number; // milliseconds to lock wallet. 0: never lock. 1: never to reset it;
  isLockDelayed?: boolean;
  showUnlockModal?: boolean;
}
export interface IUnlockFormFields {
  keystore: { [index: string]: string };
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
