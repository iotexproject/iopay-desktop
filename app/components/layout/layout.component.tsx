import { WalletOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { createHashHistory } from 'history';
import { useObserver } from 'mobx-react';
import { t } from 'onefx/lib/iso-i18n';
import React, { useState } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router';
import { UnlockWalletComponent } from './unlock-wallet/unlock.component';
import { WalletComponent } from './wallet/wallet.component';

const history = createHashHistory();
export const LayoutComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  return useObserver(() => {
    const { Header, Footer, Sider } = Layout;
    return (
      <Layout style={{ height: '100%' }}>
        <Header className="header" style={{ padding: 0 }}>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider
            theme="dark"
            width={200}
            className="site-layout-background"
            onCollapse={setCollapsed}
            collapsed={collapsed}
          >
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['wallet']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item
                key="wallet"
                icon={<WalletOutlined />}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {t('wallet.title.wallet')}
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Router history={history}>
              <Switch>
                <Route path="/unlock" component={UnlockWalletComponent} />
                <Route path="/wallet" component={WalletComponent} />
                <Redirect path="/" to="/unlock" />
              </Switch>
            </Router>
            <Footer
              style={{
                textAlign: 'center',
              }}
            >
              © 2020 IoTeX
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    );
  });
};
