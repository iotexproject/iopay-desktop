import React, { useState } from 'react'
import { observer } from "mobx-react-lite"
import MainLayout from "../Layout"
import { useStore } from "../../store/index"
import { HomeNotice } from '../notice'

const Dashboard = observer(() => {
  const [showNotice, setNotice] = useState(false)
  const { wallet } = useStore()
  return (
    <MainLayout>
      {/* notcie */}
      {showNotice ? <HomeNotice closeNotice={() => setNotice(false)} /> : <div>
        <div>{wallet.curAccount.balance} IOTX</div>
        <div>{wallet.curAccount.address}</div>
      </div>}
    </MainLayout>
  )
})

export default Dashboard
