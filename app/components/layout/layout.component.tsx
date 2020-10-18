import { WalletOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { createHashHistory } from 'history';
import { useObserver } from 'mobx-react';
import React, { useState } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router';
import { useStore } from '../../stores/index';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
import { UnlockWalletComponent } from './unlock-wallet/unlock.component';
import { WalletComponent } from './wallet/wallet.component';
import { Link } from 'react-router-dom';

const history = createHashHistory();
export const LayoutComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { lang } = useStore();
  return useObserver(() => {
    const { Header, Footer, Sider } = Layout;
    return (
      <Router history={history}>
        <Layout style={{ height: '100%' }}>
          <Header className="header" style={{ padding: 0 }}>
            <Menu theme="dark" mode="horizontal">
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
          </Header>
          <Layout>
            <Sider theme="dark" width={200} className="site-layout-background" onCollapse={setCollapsed} collapsed={collapsed}>
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['wallet']} defaultOpenKeys={['sub1']} style={{ height: '100%', borderRight: 0 }}>
                <Menu.Item key="wallet" icon={<WalletOutlined />} style={{ display: 'flex', alignItems: 'center' }}>
                  <Link to="/unlock" >{lang.t('wallet.title.wallet')}</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
              <Switch>
                <Route path="/create-wallet" component={CreateWalletComponent} />
                <Route path="/unlock" component={UnlockWalletComponent} />
                <Route path="/wallet" component={WalletComponent} />
                <Redirect path="/" to="/unlock" />
              </Switch>
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
      </Router>
    );
  });
};
