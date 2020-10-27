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

  public defaultERC20Tokens = [
    "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw",
    "io14j96vg9pkx28htpgt2jx0tf3v9etpg4j9h384m"
  ] as string[];

  public vitaTokens = [
    "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw", // VITA Production
    "io14j96vg9pkx28htpgt2jx0tf3v9etpg4j9h384m" // VITA Testnet
  ] as string[];
}
