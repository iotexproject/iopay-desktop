import { ipcRenderer } from "electron"
import { ITypedIpcRenderer } from "../../utils/typed-ipc"

export const typedIpcRender = ipcRenderer as ITypedIpcRenderer
