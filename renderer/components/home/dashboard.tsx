import { observer } from "mobx-react-lite"
import MainLayout from "../Layout"
import { useStore } from "../../store/index"

const Dashboard = observer(() => {
  const { wallet } = useStore()
  return (
    <MainLayout>
      <div>
        <div>{wallet.curAccount.balance} IOTX</div>
        <div>{wallet.curAccount.address}</div>
      </div>
    </MainLayout>
  )
})

export default Dashboard
