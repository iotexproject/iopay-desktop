import Dexie from "dexie"

export interface IAccount {
  id?: number
  address: string
  privateKey: string
}

export interface IKV {
  id?: number
  key: string
  value: string
}

export interface IAccountMeta {
  id?: number
  adderss: string
  key: string
  value: string
}

export class DB extends Dexie {
  account: Dexie.Table<IAccount, number>
  accountMeta: Dexie.Table<IAccountMeta, number>
  kv: Dexie.Table<IKV, number>

  constructor() {
    super("MyAppDatabase")
    this.version(1).stores({
      account: "++id, &address, privateKey",
      accountMeta: "++id, address, key, value",
      kv: "++id, key, value",
    })
    this.account = this.table("account")
    this.kv = this.table("kv")
  }
}

export const db = new DB()
