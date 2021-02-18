import React, { ReactNode, useState } from "react"
import Head from "next/head"
import { Menu, Layout, Popover, Checkbox, Input } from "antd"
import { DoubleLeftOutlined, DoubleRightOutlined, LogoutOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'
import Link from "next/link"
import { WalletOutlined, HomeOutlined, SearchOutlined } from "@ant-design/icons"
import { css } from "../utils/stitches.config"
import { useStore } from "../store/index"
import { observer } from "mobx-react-lite"
import { useRouter } from "next/router"

type Props = {
  children: ReactNode
  title?: string
  showSider?: boolean,
  showBgColor?: boolean
}
const { Header, Sider, Content } = Layout



const MainLayout = observer(({ children, title = "This is the default title", showSider = true, showBgColor = true }: Props) => {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const { lang, wallet } = useStore()

  const menus = [
    { name: lang.t("home"), path: '/home', icon: <HomeOutlined style={{ fontSize: 20 }} /> },
    { name: lang.t("wallet"), path: '/wallet', icon: <WalletOutlined style={{ fontSize: 20 }} /> },
  ]

  const onChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
  }


  return (
    <Layout className="h-full">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Layout>
        {showSider && (
          <Sider trigger={null} theme="dark" collapsible style={{ background: '#292936', color: '#B4B8CB' }} width={220} onCollapse={setCollapsed} collapsed={collapsed}>
            <div className={`${styles.logo} flex items-center justify-between`}>
              <div className="flex items-center">
                <img src="icons/iopay_logo_icon.png" alt="" />
                <span className="title">{collapsed ? '' : 'ioPay'}</span>
              </div>
            </div>
            <Menu
              theme="dark"
              mode="inline"
              style={{ background: '#292936' }}
              defaultSelectedKeys={[router.pathname]}
              defaultOpenKeys={["sub1"]}
              className="test"
            >
              <Menu.Item key="/home" icon={<HomeOutlined />} className="flex items-center" style={{ marginTop: 0 }}>
                <Link href="/home">{lang.t("home")}</Link>
              </Menu.Item>
              <Menu.Item key="/wallet" icon={<WalletOutlined />} className="flex items-center" style={{ marginTop: 0 }}>
                <Link href="/wallet">{lang.t("wallet")}</Link>
              </Menu.Item>
              <Menu.Item key="/setting" icon={<SettingOutlined />} className="flex items-center" style={{ marginTop: 0 }}>
                <Link href="/setting">{lang.t("setting")}</Link>
              </Menu.Item>
            </Menu>
          </Sider>
        )}
        <Layout>
          <Header style={{ padding: 0, background: '#292936', paddingRight: 24 }} className="flex items-center justify-between">
            <>
              <span className={styles.triggerIcon} onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
              </span>
              <article className="flex items-center flex-1 justify-end">
                <Input className={styles.search} placeholder="Search..." prefix={<SearchOutlined />} />
                {!wallet.curAccount ? <Popover placement="bottomRight" title={
                  <div className={`${styles.walletTitle} flex items-center justify-between`}>
                    <span>Switch Wallet</span>
                    <div className="flex items-center">
                      <LogoutOutlined style={{ fontSize: 18, color: '#B4B8CB' }} className="cursor-pointer" />
                      <PlusOutlined className="ml-3 cursor-pointer" style={{ fontSize: 18, color: '#B4B8CB' }} />
                    </div>
                  </div>
                } content={
                  <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                    {
                      [1, 2, 3].map(item => {
                        return <div key={item} className={`${styles.walletItem} flex items-center justify-between`}>
                          <div className="flex items-center">
                            <img className="wallet-icon" src="icons/logo.png" alt="" />
                            <span>Wallet {item}</span>
                          </div>
                          <Checkbox value={item}></Checkbox>
                        </div>
                      })
                    }
                  </Checkbox.Group>
                } trigger="hover">
                  <div className={`flex items-center cursor-pointer ${styles.userinfos}`}>
                    <img className="logo" src="icons/logo.png" alt="" />
                    <span>Wallet 1</span>
                    <img className="switchWallet" src="icons/switch-wallet.png" alt="" />
                  </div>
                </Popover> : <div className={styles.loginBtn}>
                    <Link href="/login">{lang.t("Login")}</Link>
                  </div>}
              </article>
            </>
          </Header>
          <Content
            style={{
              padding: showBgColor ? 24 : 0,
              margin: 24,
              minHeight: 280,
              background: showBgColor ? "white" : 'transparent',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
})

const styles = {
  logo: css({
    height: "64px",
    background: "#292936",
    padding: '0 24px',
    img: {
      width: 32,
      height: 32,
      marginRight: 8,
    },
    ".title": {
      fontSize: '1.125rem',
      color: '#B4B8CB',
      fontWeight: 500,
      fontFamily: "Roboto"
    }
  }),
  triggerIcon: css({
    color: '#B4B8CB',
    cursor: 'pointer'
  }),
  userinfos: css({
    ".logo": {
      width: 24,
      height: 24,
      marginRight: 8,
    },
    span: {
      fontSize: '0.875rem',
      marginRight: 8,
      color: '#fff'
    },
    ".switchWallet": {
      width: 24,
      height: 24
    }
  }),
  search: css({
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#B4B8CB',
    fontSize: '1rem',
    borderRadius: 4,
    border: 'none',
    width: 256,
    marginRight: 34,
    ".ant-input": {
      background: 'transparent',
      color: '#B4B8CB',
    }
  }),
  walletTitle: css({
    width: 192,
    height: '34px'
  }),
  loginBtn: css({
    fontSize: '0.875rem',
    color: '#fff'
  }),
  walletItem: css({
    padding: '10px 0',
    marginBottom: 10,
    "&:last-child": {
      marginBottom: 0
    },
    ".wallet-icon": {
      width: 24,
      height: 24,
      marginRight: 8,
    },
    span: {
      fontSize: '0.875rem',
      color: '#595959'
    }
  })
}
export default MainLayout
