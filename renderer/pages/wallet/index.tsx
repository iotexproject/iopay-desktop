import React, { useState } from 'react';
import { observer } from "mobx-react-lite"
import MainLayout from "../../components/Layout"
import { useStore } from "../../store/index"
import { css } from "../../utils/stitches.config"
import { Dialog } from '../../components/Dialog'
import { Input, Alert, Divider } from 'antd';

const IndexPage = observer(() => {
  const [visible, setVisible] = useState(false)
  const { wallet } = useStore()
  return (
    <MainLayout title="Wallet" showBgColor={false}>
      <ul className={styles.walletList}>
        <li className="flex justify-between items-start">
          <section>
            <div className="flex items-center mb-24">
              <img src="icons/logo.png" className="logo mr-4" alt="" />
              <div>
                <span>Wallet 1</span>
                {wallet.curAccount && <p>{wallet.curAccount.address}</p>}
              </div>
            </div>
            <button onClick={() => setVisible(true)}>Export Wallet</button>
          </section>
          <img className="qrcode" src="images/qrcode.png" alt="" />
        </li>
      </ul>
      {visible && <Dialog title="Password" width={600} close={() => setVisible(false)}>
        <Input size="large" placeholder="Type Your Password" className="mb-8" />
        <Alert message={
          <div className="py-2">
            <p className="text-lg mb-2">Note</p>
            <p className="text-sm">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          </div>
        } type="warning" />
      </Dialog>}
    </MainLayout>
  )
})

const styles = {
  walletList: css({
    li: {
      padding: '24px 40px 48px 24px',
      backgroundColor: '#fff',
      borderRadius: 8,
      ".logo": {
        width: 64,
        height: 64,
        marginRight: 20
      },
      span: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#3F3D56',
        marginBottom: '0.5rem'
      },
      p: {
        fontSize: '1.125rem',
        color: '#3F3D56'
      },
      ".qrcode": {
        width: 180
      },
      button: {
        width: 240,
        height: 40,
        borderRadius: 4,
        backgroundColor: '#00B4A0',
        lineHeight: '40px',
        fontSize: '1rem',
        color: '#fff',
        border: 'none',
        outline: 'none'
      }
    }
  })
}

export default IndexPage
