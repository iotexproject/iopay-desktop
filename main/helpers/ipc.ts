import { store } from "./store"
import { ipcMain } from "electron"
import { ITypedIpcMain } from "../../utils/typed-ipc"

export const typedIpcMain = ipcMain as ITypedIpcMain

export const initIPC = () => {
  typedIpcMain.handle("store.get", (_, key) => {
    return store.get(key)
  })

  typedIpcMain.handle("store.set", (_, key, value) => {
    console.log({ key, value })
    return store.set(key, value)
  })
}
