import { observer } from "mobx-react-lite"
import { useStore } from "../../store/index"
import Dashboard from "../../components/home/dashboard"
import { WalletImport } from "../../components/wallet/import"
// import { WellcomeIntro } from '../../components/wellcome'

// WellcomeIntro 是初始化界面

const IndexPage = observer(() => {
  const { wallet } = useStore()

  if (!wallet.curAccount) return <WalletImport />
  return <Dashboard />
})

export default IndexPage
