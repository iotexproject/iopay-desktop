import React from 'react';
import { colors } from '../../../../constants/colors';
import { SimpleFlexComponent } from '../../../../modules/stitches/component';
import { useStore } from '../../../../stores';
const pkg = require('../../../../package.json');

export const VersionInfoComponent = () => {
  const { lang } = useStore();
  return (
    <SimpleFlexComponent>
      <span style={{ width: '100%', textAlign: 'right', color: colors.black80 }}>
        {`${lang.t('wallet.desktop.appVersion')}: ${pkg.version}`}
      </span>
    </SimpleFlexComponent>
  );
};
