import React from 'react';
import { useStore } from '../stores';
import { Row } from 'antd';
import { onElectronClick } from '../components/layout/wallet/wallet-right/walllet-right-body.component';

export const renderSymbol = (
  symbol: string,
  href: string,
  linkName: string
) => {
  const { lang } = useStore();
  return (
    <>
      <Row>{symbol}</Row>
      <Row>
        <a
          href={href}
          style={{ marginRight: 4, cursor: 'pointer' }}
          target="_blank noopener noreferer"
          onClickCapture={() => onElectronClick(href)}
        >
          {lang.t(linkName)}
        </a>
      </Row>
    </>
  );
};
