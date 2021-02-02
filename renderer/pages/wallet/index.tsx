
import { observer } from "mobx-react-lite";
import Layout from "../../components/Layout"
import { useStore } from '../../store/index';

const IndexPage = observer(() => {
  const {wallet} = useStore()
  return (
    <Layout title="Wallet">
      <h1>Notice!</h1>
      <p>
        {JSON.stringify(wallet.account?.address)}
      </p>
    </Layout>
  )
})

export default IndexPage
