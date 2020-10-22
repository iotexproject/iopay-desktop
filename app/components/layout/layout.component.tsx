import { WalletOutlined } from '@ant-design/icons';
import { Layout, Menu, Row } from 'antd';
import { createHashHistory } from 'history';
import { useObserver } from 'mobx-react';
import React, { useState } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { useStore } from '../../stores/index';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
import { UnlockWalletComponent } from './unlock-wallet/unlock.component';
import { WalletComponent } from './wallet/wallet.component';

const history = createHashHistory();
export const LayoutComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { lang } = useStore();
  return useObserver(() => {
    const { Header, Footer, Sider } = Layout;
    return (
      <Router history={history}>
        <Layout className="h-full">
          <Header className="header p-0">
            <Menu theme="dark" mode="horizontal">
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
          </Header>
          <Layout className="relative">
            <Sider collapsible={true} theme="dark" width={200} className="site-layout-background" onCollapse={setCollapsed} collapsed={collapsed}>
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['wallet']} defaultOpenKeys={['sub1']} className="h-full border-r-0">
                <Menu.Item key="wallet" icon={<WalletOutlined />} className="flex items-center" style={{ marginTop: 0 }}>
                  <Link to="/unlock">{lang.t('wallet.title.wallet')}</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout className="p-10">
              <Row>
                <Switch>
                  <Route path="/create-wallet" component={CreateWalletComponent} />
                  <Route path="/unlock" component={UnlockWalletComponent} />
                  <Route path="/wallet" component={WalletComponent} />
                  <Redirect path="/" to="/unlock" />
                </Switch>
              </Row>
            </Layout>
            <Footer className="items-center absolute bottom-0 text-center w-full flex items-center justify-center" style={{ padding: '10px 0' }}>
              © 2020 IoTeX
            </Footer>
          </Layout>
        </Layout>
      </Router>
    );
  });
};
