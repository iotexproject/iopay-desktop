import isElectron from "is-electron";
import { shell } from "electron";

export const onElectronClick = (url: string) => (e: MouseEvent): boolean => {
  if (!isElectron()) {
    return true;
  }
  e.preventDefault();
  shell.openExternal(url);
  return false;
};
