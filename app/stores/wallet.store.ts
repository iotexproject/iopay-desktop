import { plainToClass } from 'class-transformer';
import { Account } from 'iotex-antenna/lib/account/account';
import { action, observable } from 'mobx';
import { IRPCProvider } from '../interfaces/rpc-provider.interface';
import { IWalletState } from '../interfaces/wallet.interface';
import { LockWalletMilliseconds } from '../models/locak-wallet.enum';

export class WalletStore {
  @observable
  public readonly state: IWalletState = {
    account: plainToClass(Account, {}),
    hideExport: true,
    network: {} as IRPCProvider,
    customRPCs: [] as IRPCProvider[],
    tokens: {},
    defaultNetworkTokens: [],
    lockAt: LockWalletMilliseconds.NeverLock,
    isLockDelayed: false,
  };

  @action.bound
  public setAccount(args?: Partial<IWalletState>) {
    return Object.assign(this.state, args)
  }

  @action.bound
  public setNetWork(network: IRPCProvider, tokens: string[]) {
    return Object.assign(this.state, { network, defaultNetworkTokens: tokens });
  }

  @action.bound
  public addCustomRpc(rpc: IRPCProvider) {
    const newRpcs = [...this.state.customRPCs, rpc];
    return Object.assign(this.state, { customRPCs: newRpcs }) as IWalletState;
  }
}
