import { getAntenna } from "../utils/antenna"
import { fromRau } from "iotex-antenna/lib/account/utils"
import { makeAutoObservable } from "mobx"
import { storeUtils } from "../utils/store"
import { IAccount } from "iotex-antenna/lib/account/account"

export class Account {
  address: string
  balance: string = "0"
  privateKey: string
  constructor(data: Partial<Account>) {
    console.log({ data })
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
  constructor() {
    makeAutoObservable(this)
  }

  account = ""
  accounts: Record<string, Account> = {}

  async setcurAccount(account) {
    this.account = account
    await storeUtils.setCurAccount(account)
  }

  get curAccount() {
    return this.accounts[this.account]
  }
  async init() {
    await Promise.all([this.loadCurAccount(), this.loadAccounts()])
  }

  async addAccount({ account }: { account: IAccount }) {
    if (this.accounts[account.address]) {
      return
    }
    const newAccount = new Account(account)
    await newAccount.loadBalance()
    this.accounts[account.address] = newAccount
    await storeUtils.saveAccount(newAccount)
  }
  async loadCurAccount() {
    this.account = await storeUtils.getCurAccount()
  }

  async loadAccounts() {
    const accounts = await storeUtils.getAccounts()
    if (accounts.length) {
      accounts.forEach((i) => {
        this.accounts[i.address] = new Account(i)
        if (!this.account) {
          this.setcurAccount(i.address)
        }
      })
    }
  }
}
