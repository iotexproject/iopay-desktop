import Dexie from "dexie"

export class DB extends Dexie {
  account: Dexie.Table<IAccount, string>
  accountMeta: Dexie.Table<IAccountMeta, string>
  kv: Dexie.Table<IKV, string>

  constructor() {
    super("iopay")
    this.version(1).stores({
      account: "&address, privateKey",
      accountMeta: "[address+key], value",
      kv: "key, value",
    })
    this.account = this.table("account")
    this.kv = this.table("kv")
    this.accountMeta = this.table("accountMeta")
  }
}

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
  address: string
  key: string
  value: string
}

export const db = new DB()
