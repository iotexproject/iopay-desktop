import { FormInstance } from 'antd/lib/form/Form';

export interface IUnlockByKeyStoreFileState {
  priKey: string;
  isDecrypting: boolean;
}

export type KeystoreProps = { form: FormInstance };
export type KeystoreState = {
  keystores: { [index: string]: string };
  keyname: string;
};
