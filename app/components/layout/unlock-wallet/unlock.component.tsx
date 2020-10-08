import { Alert, Layout, Modal, Tabs } from 'antd';
import isElectron from 'is-electron';
import { t } from 'onefx/lib/iso-i18n';
import React, { useState } from 'react';
import { UnlockComponentProps } from '../../../interfaces/wallet.interface';
import {
  CommonMarginComponent,
  StyleLinkComponent,
  WalletTitleComponent,
} from '../../share/share.component';
import { UnlockByKeystoreFileComponent } from './unlock-by-key-store-file';
import './unlock.component.scss';

const { Content } = Layout;

export const UnlockWalletComponent = (props: UnlockComponentProps) => {
  const [showModal, setShowModal] = useState(false);
  const { chainId } = props;
  const createNewWallet = (status: boolean) => {
    setShowModal(false);
    if (status) {
      props.setCreateNew();
    }
  };
  return (
    <Content className="unlock--component">
      <div>
        <Modal
          title={t('wallet.unlock.new.title')}
          visible={showModal}
          onOk={() => createNewWallet(true)}
          onCancel={() => createNewWallet(false)}
          okText={t('wallet.unlock.new.yes')}
        >
          <p>{t('wallet.unlock.new.p1')}</p>
          <p>{t('wallet.unlock.new.p2')}</p>
        </Modal>

        <WalletTitleComponent>{t('unlock-wallet.title')}</WalletTitleComponent>

        {!isElectron() && (
          <>
            <Alert message={t('unlock-wallet.warn.message')} type="warning" />
            <CommonMarginComponent />
          </>
        )}

        <Tabs onChange={() => undefined} type="card">
          <Tabs.TabPane tab={t('unlock-wallet.by_keystore')} key="1">
            <UnlockByKeystoreFileComponent />
          </Tabs.TabPane>
          <Tabs.TabPane tab={t('unlock-wallet.by_private_key')} key="2">
            UnlockByPrivateKey
          </Tabs.TabPane>
          <Tabs.TabPane tab={t('unlock-wallet.by_mnemonic')} key="3">
            UnlockByMnemonic
          </Tabs.TabPane>
          {isElectron() && (
            <Tabs.TabPane tab={t('unlock-wallet.by_ledger')} key="4">
              UnlockByLedger
            </Tabs.TabPane>
          )}
        </Tabs>

        <div style={{ paddingTop: '24px' }}>
          <p>
            {t('unlock-wallet.no-wallet')}
            {chainId === 1 ? (
              <StyleLinkComponent
                style={{ paddingLeft: '10px', cursor: 'pointer' }}
                onClick={() => {
                  setShowModal(true);
                }}
              >
                {t('unlock-wallet.create')}
              </StyleLinkComponent>
            ) : (
              <span style={{ paddingLeft: '10px' }}>
                {t('unlock-wallet.main-chain')}
              </span>
            )}
          </p>
        </div>
      </div>
    </Content>
  );
};
