import React, { ReactNode, useState } from "react";
import Head from "next/head";
import { Menu, Layout } from "antd";
import Link from "next/link";
import { WalletOutlined } from "@ant-design/icons";
import { css } from "../utils/stitches.config";
import { useStore } from "../store/index";

type Props = {
  children: ReactNode;
  title?: string;
};
const { Header, Sider, Content } = Layout;

const MainLayout = ({
  children,
  title = "This is the default title",
}: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const { lang } = useStore();

  return (
    <Layout className="h-full">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header className="header">
        <div className={styles.logo} />
        {/* <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu> */}
      </Header>
      <Layout>
        <Sider
          collapsible={true}
          theme="dark"
          width={200}
          onCollapse={setCollapsed}
          collapsed={collapsed}
        >
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["wallet"]}
            defaultOpenKeys={["sub1"]}
            className="h-full border-r-0"
          >
            <Menu.Item
              key="wallet"
              icon={<WalletOutlined />}
              className="flex items-center"
              style={{ marginTop: 0 }}
            >
              <Link href="/home">{lang.t("wallet.title.wallet")}</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content
            style={{
              padding: 24,
              margin: 24,
              minHeight: 280,
              background: "white",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

const styles = {
  logo: css({
    float: "left",
    width: "120px",
    height: "31px",
    margin: "16px 24px 16px 0",
    background: "rgba(255, 255, 255, 0.3)",
  }),
};
export default MainLayout;
