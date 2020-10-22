import { observable } from 'mobx';
import remotedev from 'mobx-remotedev';
import { IRPCProvider } from '../interfaces/rpc-provider.interface';

@remotedev({ name: 'base' })
export class BaseStore {
  @observable NODE_ENV = process.env.NODE_ENV;

  @observable
  public multiChain: {
    current: string,
    chains: IRPCProvider[]
  } = {
      current: '',
      chains: [
        {
          name: "MAINNET",
          url: "https://iotexscan.io/",
          coreApi: "https://iotexscan.io/",
        },
        {
          name: "TESTNET",
          url: "https://testnet.iotexscan.io/",
          coreApi: "https://testnet.iotexscan.io/",
        }
      ],
    };

  @observable
  public defaultERC20Tokens = [] as string[];
}
