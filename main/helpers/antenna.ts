import Antenna from "iotex-antenna"

export const antenna = new Antenna("https://api.iotex.one")

export const antennaUtils = {
  privateKeyToAccount(privateKey: string) {
    return antenna.iotx.accounts.privateKeyToAccount(privateKey)
  },
}
