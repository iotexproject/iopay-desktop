import Antenna from "iotex-antenna"
import { antennaUtils } from "../main/helpers/antenna"

declare module "electron" {
  interface App extends NodeJS.EventEmitter {
    antenna: Antenna
    antennaUtils: typeof antennaUtils
  }
}
