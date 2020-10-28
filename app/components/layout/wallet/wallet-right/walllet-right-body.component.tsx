import { EyeOutlined } from '@ant-design/icons';
import { Row } from 'antd';
import { shell } from 'electron';
import React from 'react';
import { DISCORD_URL, VOTING_URL } from '../../../../constants/url';

export const WalletRightBody = () => {
  return (
    <div className="w-full" style={{ background: '#fff' }}>
      <Row className="justify-end py-2 px-8">
        <span>
          <EyeOutlined /> Show Balance
        </span>
      </Row>
      <Row className="py-2 px-8 justify-between">
        <Row>
          IOTX
          <span>{0}</span>
        </Row>
        <Row>
          <a href="javascript:void 0;" onClick={() => shell.openExternal(VOTING_URL)}>Vote for delegate</a>
        </Row>
      </Row>
      <Row className="py-2 px-8 justify-between">
        <Row>
          VITA
          <span>{0}</span>
        </Row>
        <Row>
          <a href="javascript:void 0;" onClick={() => shell.openExternal(DISCORD_URL)}>Join Discord</a>
        </Row>
      </Row>
      <Row className="py-2 px-8">3</Row>
    </div>
  );
};
