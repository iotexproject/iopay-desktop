import { db } from "./db"

class StoreUitls {
  async getCurAccount() {
    const account = await db.kv.where("key").equals("iotex.curAccount").first()
    return account ? account.value : ""
  }
  async setCurAccount(account) {
    db.kv.where("key").equals("iotex.curAccount").modify(account)
  }

  async getAccounts() {
    return db.account.toArray()
  }

  async saveAccount(account) {
    db.account.add(account)
  }
}

export const storeUtils = new StoreUitls()
