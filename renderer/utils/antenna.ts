import Antenna from "iotex-antenna"
import electron from "electron"

export const getAntenna = () => {
  return electron.remote.app.antenna
}

export const getAntennaUtils = () => {
  return electron.remote.app.antennaUtils
}
