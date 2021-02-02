import React from "react"
import { BaseStore } from "./base"
import { LangStore } from "./lang"
import { WalletStore } from "./wallet"
import { toJS } from "mobx"

const rootStore = {
  base: new BaseStore(),
  wallet: new WalletStore(),
  lang: new LangStore(),
}

export const StoresContext = React.createContext(rootStore)

export const useStore = () => React.useContext(StoresContext)

if (typeof window !== "undefined") {
  //@ts-ignore
  window.store = new Proxy(rootStore, {
    get(target, props, receiver) {
      //@ts-ignore
      return toJS(target[props])
    },
  })
}
