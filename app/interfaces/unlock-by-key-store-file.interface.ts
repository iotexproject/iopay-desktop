import { IUnlockFormFields } from './wallet.interface';

export interface IUnlockByKeyStoreFileState {
  priKey: string;
  isDecrypting: boolean;
}

export type KeystoreProps = {
  setFormFiled: (obj: Partial<IUnlockFormFields>) => void;
};
export type KeystoreState = {
  keystores: { [index: string]: string };
  keyname: string;
};
