import Button from 'antd/lib/button';
import { RemoteAccount } from 'iotex-antenna/lib/account/account';
import { publicKeyToAddress } from 'iotex-antenna/lib/crypto/crypto';
import { t } from 'onefx/lib/iso-i18n';
import React, { useState } from 'react';
import { LedgerPlugin } from '../../../models/ledger-plugin.model';
import { useStore } from '../../../stores';
import { assetURL } from '../../../utils/asset-url';
import { getAntenna } from '../../../utils/get-antenna';
import { getTransportProxy } from '../../../utils/get-proxy';
import {
  CommonMarginComponent,
  InputErrorComponent,
} from '../../share/share.component';

export const UnlockByLedgerComponent = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const { wallet } = useStore();
  const unlockWallet = async () => {
    setErrorMessage('');
    setIsPending(true);
    try {
      const proxy = await getTransportProxy();
      const publicKey = await proxy.getPublicKey([44, 304, 0, 0, 0]);

      if (!publicKey) {
        return;
      }
      const ledgerPlugin = new LedgerPlugin(
        [44, 304, 0, 0, 0],
        publicKey,
        proxy
      );
      const antenna = getAntenna(true, ledgerPlugin);

      const account = new RemoteAccount(
        publicKeyToAddress(Buffer.from(publicKey).toString('hex')),
        ledgerPlugin
      );
      antenna.iotx.accounts.addAccount(account);

      // this.props.dispatch(setAccount(account, true));
      wallet.setAccount(account, true);
    } catch (e) {
      setErrorMessage(
        t('unlock_by_ledger.error', {
          message: e.message || '',
        })
      );
    }

    // this.setState({ isPending: false });
    setIsPending(false);
  };

  return (
    <div>
      <CommonMarginComponent />
      <img
        style={{
          maxHeight: '64px',
        }}
        src={assetURL('connect-ledger.png')}
        alt="connect ledger"
      />

      <CommonMarginComponent />

      <CommonMarginComponent>
        <Button htmlType="button" onClick={unlockWallet} loading={isPending}>
          {t('wallet.account.unlock')}
        </Button>
        {errorMessage && (
          <InputErrorComponent style={{ color: '#d93900' }}>
            {errorMessage}
          </InputErrorComponent>
        )}
      </CommonMarginComponent>
    </div>
  );
};
