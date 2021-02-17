import Antenna from "iotex-antenna"
import { antennaUtils } from "../main/helpers/antenna"
import { store } from "../main/helpers/store"

declare module "electron" {
  interface App extends NodeJS.EventEmitter {
    antenna: Antenna
    antennaUtils: typeof antennaUtils
    store: typeof store
  }
}
