import { observable } from 'mobx';
import remotedev from 'mobx-remotedev';

@remotedev({ name: 'base' })
export class BaseStore {
  @observable NODE_ENV = process.env.NODE_ENV;
}
