import { WalletOutlined } from '@ant-design/icons';
import { Layout, Menu, Row } from 'antd';
import { createHashHistory } from 'history';
import { useObserver } from 'mobx-react';
import React, { useState } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { useStore } from '../../stores/index';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
// import { UnlockWalletComponent } from './unlock-wallet/unlock.component';
import { WalletComponent } from './wallet/wallet.component';
import { WellcomeIntro } from './home/wellcome-intro'
import { HomeNotice } from './home/home-notice'
import { HomeImportWallet } from './home/home-import-wallet'
import { css } from '../../modules/stitches';

//@ts-ignore
import iopay from '../../../resources/images/iopay.png';
import leftIcon from '../../../resources/images/left_icon.png';

const history = createHashHistory();
export const LayoutComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { lang } = useStore();
  return useObserver(() => {
    const { Header, Sider } = Layout;
    return (
      <Router history={history}>
        <Layout className="h-full">
          <Header style={{ padding: 0, background: "#20202C" }}>
            <div className={styles.logoWrapper}>
              <img className="iopay" src={iopay} alt="" />
              <span>ioPay</span>
              <img
                className="leftIcon" src={leftIcon} alt=""
                style={{ transform: `rotate(${collapsed ? '180deg' : '0'})` }}
                onClick={() => setCollapsed(!collapsed)} />
            </div>
          </Header>
          <Layout className="relative">
            <Sider style={{ background: "#20202C" }} width={200} className="site-layout-background" onCollapse={setCollapsed} collapsed={collapsed}>
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['wallet']} defaultOpenKeys={['sub1']} className="h-full border-r-0">
                {/* <Menu.Item key="wallet" icon={<WalletOutlined />} className="flex items-center" style={{ marginTop: 0 }}>
                  <Link to="/unlock">{lang.t('wallet.title.wallet')}</Link>
                </Menu.Item> */}
                <Menu.Item key="home" icon={<WalletOutlined />} className="flex items-center" style={{ marginTop: 0 }}>
                  <Link to="/unlock">{lang.t('home')}</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout className="p-10">
              <Row>
                <Switch>
                  <Route path="/welcome" component={WellcomeIntro} />
                  <Route path="/notice" component={HomeNotice} />
                  <Route path="/unlock" component={HomeImportWallet} />
                  <Route path="/create-wallet" component={CreateWalletComponent} />
                  {/* <Route path="/unlock" component={UnlockWalletComponent} /> */}
                  <Route path="/wallet" component={WalletComponent} />
                  <Redirect path="/" to="/unlock" />
                </Switch>
              </Row>
            </Layout>
          </Layout>
        </Layout>
      </Router>
    );
  });
};


const styles = {
  logoWrapper: css({
    width: "200px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "20px",
    boxSizing: "border-box",
    ".iopay": {
      width: "32px",
      height: "32px",
      marginRight: "8px",
    },
    span: {
      fontSize: "18px",
      fontWeight: 500,
      color: "#B4B8CB",
      marginRight: "64px"
    },
    ".leftIcon": {
      width: "12px",
      height: "12px"
    }
  })
}
