import Layout from "../Layout"
import { Alert, Col, Modal, Row, Tabs } from "antd"
import { useStore } from "../../store/index"
import { UnlockByMnemonicComponent } from "../home/unlock-by-mnemonic-phrase.component"
import { UnlockByPrivateKeyComponent } from "../home/unlock-by-private-key.component"
import { UnlockByKeystoreFileComponent } from "../home/unlock-by-key-store-file"
import { observer } from "mobx-react-lite"

export const WalletImport = observer(() => {
  const { lang } = useStore()
  return (
    <Layout title="Import!">
      <h1>{lang.t("unlock-wallet.title")}</h1>
      <Tabs type="card">
        <Tabs.TabPane tab={lang.t("unlock-wallet.by_mnemonic")} key={3}>
          <UnlockByMnemonicComponent />
        </Tabs.TabPane>
        <Tabs.TabPane tab={lang.t("unlock-wallet.by_keystore")} key={1}>
          <UnlockByKeystoreFileComponent />
        </Tabs.TabPane>
        <Tabs.TabPane tab={lang.t("unlock-wallet.by_private_key")} key={2}>
          <UnlockByPrivateKeyComponent />
        </Tabs.TabPane>
        <Tabs.TabPane tab={lang.t("unlock-wallet.by_ledger")} key={4}></Tabs.TabPane>
      </Tabs>
    </Layout>
  )
})
