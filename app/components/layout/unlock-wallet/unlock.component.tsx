import { Alert, Col, Layout, Modal, Row, Tabs } from 'antd';
import isElectron from 'is-electron';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { CommonMarginComponent, StyleLinkComponent, WalletTitleComponent } from '../../../modules/stitches/component';
import { useStore } from '../../../stores';
import { EmptyWalletComponent } from './empty-wallet/empty-wallet.component';
import { UnlockByKeystoreFileComponent } from './unlock-by-key-store-file';
import { UnlockByLedgerComponent } from './unlock-by-ledger.component';
import { UnlockByMnemonicComponent } from './unlock-by-mnemonic-phrase.component';
import { UnlockByPrivateKeyComponent } from './unlock-by-private-key.component';
import { VersionInfoComponent } from './version-info/version-info.component';

export const UnlockWalletComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [channeIndex, setChanneIndex] = useState(1);
  const { lang } = useStore();
  const history = useHistory();
  const createNewWallet = (status: boolean) => {
    setShowModal(false);
    if (status) {
      history.push('/create-wallet');
    }
  };
  return (
    <Layout.Content>
      <Row>
        <Col xs={24} sm={24} md={14} lg={14} xl={14}>
          <div>
            <Modal title={lang.t('wallet.unlock.new.title')} visible={showModal} onOk={() => createNewWallet(true)} onCancel={() => createNewWallet(false)} okText={lang.t('wallet.unlock.new.yes')}>
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

            <Tabs onChange={(key) => setChanneIndex(Number(key))} type="card">
              <Tabs.TabPane tab={lang.t('unlock-wallet.by_keystore')} key={1}>
                <UnlockByKeystoreFileComponent />
              </Tabs.TabPane>
              <Tabs.TabPane tab={lang.t('unlock-wallet.by_private_key')} key={2}>
                <UnlockByPrivateKeyComponent />
              </Tabs.TabPane>
              <Tabs.TabPane tab={lang.t('unlock-wallet.by_mnemonic')} key={3}>
                <UnlockByMnemonicComponent />
              </Tabs.TabPane>
              {isElectron() && (
                <Tabs.TabPane tab={lang.t('unlock-wallet.by_ledger')} key={4}>
                  <UnlockByLedgerComponent />
                </Tabs.TabPane>
              )}
            </Tabs>

            <div style={{ paddingTop: '24px' }}>
              <p>
                {lang.t('unlock-wallet.no-wallet')}
                {channeIndex === 1 ? (
                  <StyleLinkComponent style={{ paddingLeft: '10px', cursor: 'pointer' }} onClick={() => setShowModal(true)}>
                    {lang.t('unlock-wallet.create')}
                  </StyleLinkComponent>
                ) : (
                  <StyleLinkComponent style={{ paddingLeft: '10px', cursor: 'pointer' }}>{lang.t('unlock-wallet.main-chain')}</StyleLinkComponent>
                )}
              </p>
            </div>
          </div>
        </Col>

        <Col className="px-4" xs={24} sm={24} md={12} lg={10} xl={10}>
          <VersionInfoComponent />
          <EmptyWalletComponent />
        </Col>
      </Row>
    </Layout.Content>
  );
};
