import { Layout, Col, Row } from 'antd';
import React from 'react';
import { WalletLeftComponent } from './wallet-left.component';
import { WalletRightComponent } from './wallet-right.component';

const { Content } = Layout;
export const WalletComponent = () => <Content>
  <Row>
    <Col xs={24} sm={24} md={14} lg={14} xl={14}>
      <WalletLeftComponent />
    </Col>
    <Col xs={24} sm={24} md={10} lg={10} xl={10} className="px-4">
      <WalletRightComponent />
    </Col>
  </Row>
</Content>;
