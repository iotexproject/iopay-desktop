import BigNumber from "bignumber.js";
import { toIoTeXAddress } from "./address";
const regex = /^([0-9]+)I authorize 0x[0-9a-fA-F]{40} to claim in (0x[0-9A-Fa-f]{40})$/;

export function getNonce(msg: string, address?: string): BigNumber {
  const matches = msg.match(regex);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid authentication private message!");
  }
  if (address && toIoTeXAddress(matches[2]) !== address) {
    throw new Error(`invalid token address ${matches[2]}`);
  }
  return new BigNumber(matches[1], 10);
}
