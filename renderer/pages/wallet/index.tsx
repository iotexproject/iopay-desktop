import { observer } from "mobx-react-lite"
import MainLayout from "../../components/Layout"
import { useStore } from "../../store/index"

const IndexPage = observer(() => {
  const { wallet } = useStore()
  return (
    <MainLayout title="Wallet">
      <h1>Notice!</h1>
      <p>{wallet.account}</p>
    </MainLayout>
  )
})

export default IndexPage
