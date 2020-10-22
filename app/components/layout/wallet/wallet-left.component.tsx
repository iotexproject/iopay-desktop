import React, { useState } from 'react';
import { Tabs } from 'antd';
import { SendActionComponent } from './send-action/send-action.component';
import { useStore } from '../../../stores';
const { TabPane } = Tabs;

export const WalletLeftComponent = () => {
  const [index, setIndex] = useState('1');
  const { lang, wallet } = useStore();
  return (
    <Tabs defaultActiveKey={index} onChange={(value) => setIndex(value)}>
      <TabPane tab={lang.t('wallet.transactions.send')} key={`transfer`}>
        <SendActionComponent />
      </TabPane>
      <TabPane tab={lang.t('wallet.tab.contract')} key={`smart-contract`}>
        2
      </TabPane>
      {wallet.state.account && (
        <TabPane tab={lang.t('wallet.tab.keystore')} key={`sign`}>
          3
        </TabPane>
      )}
      <TabPane tab={lang.t('wallet.whitelist')} key={`whitelist`}>
        4
      </TabPane>
    </Tabs>
  );
};
