import { Account } from 'iotex-antenna/lib/account/account';
import { action, observable } from 'mobx';
import { IWalletState } from '../interfaces/wallet.interface';

export class UnlockStore {
  @observable state: IWalletState = {
    customRPCs: [],
    defaultNetworkTokens: [],
    tokens: {},
    lockAt: 0,
    isLockDelayed: false,
  };

  @action.bound
  setAccount(account?: Account, hideExport?: boolean) {
    return { ...this.state, account, hideExport };
  }
}
