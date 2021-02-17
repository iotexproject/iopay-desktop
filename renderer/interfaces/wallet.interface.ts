import { PrivateKey } from "iotex-antenna/lib/account/wallet"

export interface IUnlockFormFields {
  keystore: PrivateKey
  password: string
}
