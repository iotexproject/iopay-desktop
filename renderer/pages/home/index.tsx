import { observer } from "mobx-react-lite"
import { useStore } from "../../store/index"
import Dashboard from "../../components/home/dashboard"
import { WalletImport } from "../../components/wallet/import"

const IndexPage = observer(() => {
  const { wallet } = useStore()
  if (!wallet.curAccount) return <WalletImport />
  return <Dashboard />
})

export default IndexPage
