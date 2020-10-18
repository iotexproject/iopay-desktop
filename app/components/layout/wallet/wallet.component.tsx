import { Layout } from 'antd';
import React from 'react';
import { WalletLeftComponent } from './wallet-left.component';
import { WalletRightComponent } from './wallet-right.component';

const { Content } = Layout;
export const WalletComponent = () => <Content>
  <WalletLeftComponent />
  <WalletRightComponent />
</Content>;
