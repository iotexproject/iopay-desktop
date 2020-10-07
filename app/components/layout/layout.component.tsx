import { WalletOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useObserver } from 'mobx-react';
import React, { useState } from 'react';
import { UnlockComponent } from './content/unlock.component';

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
                Wallet
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <UnlockComponent />
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
