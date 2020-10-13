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
  setAccount(args: Partial<IWalletState>) {
    return Object.assign(this.state, args)
  }
}
