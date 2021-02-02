import Layout from "../../components/Layout"
import { Alert, Col, Modal, Row, Tabs } from "antd"
import { useStore } from "../../store/index"
import { UnlockByMnemonicComponent } from "../../components/home/UnlockByMnemonicComponent"
const IndexPage = () => {
  const { lang } = useStore()
  return (
    <Layout title="Import!">
      <h1>{lang.t("unlock-wallet.title")}</h1>
      <Tabs type="card">
        <Tabs.TabPane tab={lang.t("unlock-wallet.by_mnemonic")} key={3}>
          <UnlockByMnemonicComponent />
        </Tabs.TabPane>
        <Tabs.TabPane tab={lang.t("unlock-wallet.by_keystore")} key={1}></Tabs.TabPane>
        <Tabs.TabPane tab={lang.t("unlock-wallet.by_private_key")} key={2}></Tabs.TabPane>
        <Tabs.TabPane tab={lang.t("unlock-wallet.by_ledger")} key={4}></Tabs.TabPane>
      </Tabs>
    </Layout>
  )
}

export default IndexPage
