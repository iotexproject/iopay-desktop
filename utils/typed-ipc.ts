import { TypedIpcRenderer, TypedIpcMain } from "electron-typed-ipc"

export type IpcEvents = {}

export type IpcCommands = {
  "store.set": (key: string, value: any) => any
  "store.get": (key: string) => any
}
export type ITypedIpcMain = TypedIpcMain<IpcEvents, IpcCommands>

export type ITypedIpcRenderer = TypedIpcRenderer<IpcEvents, IpcCommands>
