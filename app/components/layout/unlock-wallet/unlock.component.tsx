import { Alert, Layout, Modal, Tabs } from 'antd';
import isElectron from 'is-electron';
import React, { useState } from 'react';
import { UnlockComponentProps } from '../../../interfaces/wallet.interface';
import {
  CommonMarginComponent,
  StyleLinkComponent,
  WalletTitleComponent,
} from '../../../modules/stitches/component';
import { UnlockByKeystoreFileComponent } from './unlock-by-key-store-file';
import { UnlockByLedgerComponent } from './unlock-by-ledger.component';
import { useStore } from '../../../stores/index';
import { css } from '../../../modules/stitches';

const { Content } = Layout;

export const UnlockWalletComponent = (props: UnlockComponentProps) => {
  const [showModal, setShowModal] = useState(false);
  const { chainId } = props;
  const {lang} = useStore()
  const createNewWallet = (status: boolean) => {
    setShowModal(false);
    if (status) {
      props.setCreateNew();
    }
  };
  return (
    <Content className={styles.unlock}>
      <div>
        <Modal
          title={lang.t('wallet.unlock.new.title')}
          visible={showModal}
          onOk={() => createNewWallet(true)}
          onCancel={() => createNewWallet(false)}
          okText={lang.t('wallet.unlock.new.yes')}
        >
          <p>{lang.t('wallet.unlock.new.p1')}</p>
          <p>{lang.t('wallet.unlock.new.p2')}</p>
        </Modal>

        <WalletTitleComponent>{lang.t('unlock-wallet.title')}</WalletTitleComponent>

        {!isElectron() && (
          <>
            <Alert message={lang.t('unlock-wallet.warn.message')} type="warning" />
            <CommonMarginComponent />
          </>
        )}

        <Tabs onChange={() => undefined} type="card">
          <Tabs.TabPane tab={lang.t('unlock-wallet.by_keystore')} key="1">
            <UnlockByKeystoreFileComponent />
          </Tabs.TabPane>
          <Tabs.TabPane tab={lang.t('unlock-wallet.by_private_key')} key="2">
            UnlockByPrivateKey
          </Tabs.TabPane>
          <Tabs.TabPane tab={lang.t('unlock-wallet.by_mnemonic')} key="3">
            UnlockByMnemonic
          </Tabs.TabPane>
          {isElectron() && (
            <Tabs.TabPane tab={lang.t('unlock-wallet.by_ledger')} key="4">
              <UnlockByLedgerComponent />
            </Tabs.TabPane>
          )}
        </Tabs>

        <div style={{ paddingTop: '24px' }}>
          <p>
            {lang.t('unlock-wallet.no-wallet')}
            {chainId === 1 ? (
              <StyleLinkComponent
                style={{ paddingLeft: '10px', cursor: 'pointer' }}
                onClick={() => {
                  setShowModal(true);
                }}
              >
                {lang.t('unlock-wallet.create')}
              </StyleLinkComponent>
            ) : (
              <span style={{ paddingLeft: '10px' }}>
                {lang.t('unlock-wallet.main-chain')}
              </span>
            )}
          </p>
        </div>
      </div>
    </Content>
  );
};


const styles = {
  unlock: css({
    userSelect: "none"
  })
}
