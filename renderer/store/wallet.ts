import { IAccount } from "iotex-antenna/lib/account/account"
import { getAntenna } from "../utils/antenna"
import { fromRau } from "iotex-antenna/lib/account/utils"
import { makeAutoObservable } from "mobx"
import { typedIpcRender } from "../utils/ipc"

export class Account {
  address: string
  balance: string = "0"
  constructor(data: Partial<Account>) {
    console.log({data})
    Object.assign(this, data)
    makeAutoObservable(this)
  }

  async loadBalance() {
    const data = await getAntenna().iotx.getAccount({ address: this.address })
    if (data?.accountMeta) {
      const { balance } = data?.accountMeta
      this.balance = fromRau(balance, "iotx")
    }
  }
}

export class WalletStore {
  accountIndex = 0
  //@ts-ignore
  accounts: Account[] = []
  constructor() {
    makeAutoObservable(this)
  }
  async init() {
    this.loadAccounts()
  }

  get account() {
    return this.accounts[this.accountIndex]
  }

  async setAccount({ account }: { account: IAccount }) {
    if(this.accounts.find(i => i.address === account.address)){
      return
    }
    const newAccount = new Account(account)
    await newAccount.loadBalance()
    this.accounts.push(newAccount)
    this.save()
  }

  async loadAccounts() {
    const _accounts = (await typedIpcRender.invoke("store.get", "iotex.accounts")) || "[]"
    this.accounts = JSON.parse(_accounts).map((i) => new Account(i))
  }
  async save() {
    await typedIpcRender.invoke("store.set", "iotex.accounts", JSON.stringify(this.accounts))
  }
}
