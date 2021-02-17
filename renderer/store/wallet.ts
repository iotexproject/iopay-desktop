import { getAntenna } from "../utils/antenna"
import { fromRau } from "iotex-antenna/lib/account/utils"
import { makeAutoObservable } from "mobx"
import { storeUtils } from "../utils/store"
import { IAccount } from "iotex-antenna/lib/account/account"
import { db } from "../utils/db"

export class Account {
  address: string
  balance: string = "0"
  privateKey: string
  constructor(data: Partial<Account>) {
    Object.assign(this, data)
    makeAutoObservable(this)
  }

  async loadBalance() {
    const data = await getAntenna().iotx.getAccount({ address: this.address })
    if (data?.accountMeta) {
      const { balance } = data?.accountMeta
      this.balance = fromRau(balance, "iotx")
      await db.accountMeta.put({ address: this.address, key: "iotex.balance", value: balance })
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
    storeUtils.setCurAccount(account)
  }

  get curAccount() {
    return this.accounts[this.account]
  }
  async init() {
    await Promise.all([this.loadCurAccount(), this.loadAccounts()])
    if (this.curAccount) {
      await this.curAccount.loadBalance()
    }
  }

  async addAccount({ account }: { account: IAccount }) {
    if (this.accounts[account.address]) {
      return
    }
    const newAccount = new Account(account)
    this.accounts[account.address] = newAccount
    await Promise.all([
      storeUtils.saveAccount(newAccount),
      this.setcurAccount(newAccount.address),
      newAccount.loadBalance(),
    ])
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
