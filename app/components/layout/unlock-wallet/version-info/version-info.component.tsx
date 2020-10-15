import isElectron from 'is-electron';
import React from 'react';
import { colors } from '../../../../constants/colors';
import { SimpleFlexComponent } from '../../../../modules/stitches/component';
import { useStore } from '../../../../stores';

declare const window: any;
export const getIoPayDesktopVersionName = (prefix: string = 'wallet.desktop.app') => {
  const { lang } = useStore();
  if (!isElectron() || !window.getAppInfo) {
    return '';
  }
  const appInfo = window.getAppInfo();
  const appVersion = appInfo.appVersion;
  return `${lang.t(prefix, { appVersion })}`;
};
export const VersionInfoComponent = () => {
  return (
    <SimpleFlexComponent>
      <span style={{ width: '100%', textAlign: 'right', color: colors.black80 }}>{getIoPayDesktopVersionName('wallet.desktop.appVersion')}</span>
    </SimpleFlexComponent>
  );
};
