/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import { Button, notification } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import { decrypt } from 'iotex-antenna/lib/account/wallet';
import { t } from 'onefx/lib/iso-i18n';
import React, { useState } from 'react';
import { Keystore } from './key-store.component';
import { PasswordFormInputItem } from './password-form-input.component';
import { useStore } from '../../../stores';
import { IUnlockFormFields } from '../../../interfaces/wallet.interface';
import { getAntenna } from '../../../utils/get-antenna';
import { CommonMarginComponent } from '../../share/share.component';

export const UnlockByKeystoreFileComponent = () => {
  // const [priKey, setPriKey] = useState('');
  const { wallet } = useStore();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [form] = useForm<IUnlockFormFields>();
  form.setFields([
    { name: 'password', value: '' },
    { name: 'keystore', value: {} },
  ]);
  const unlockWallet = async () => {
    setIsDecrypting(true);
    const values = await form.validateFields();
    if (values && values?.password && values?.keystore) {
      const { password, keystore } = values;
      try {
        const keyObj = JSON.parse(keystore);
        const { privateKey } = decrypt(keyObj, password);
        const antenna = getAntenna(true);
        const account = await antenna.iotx.accounts.privateKeyToAccount(
          privateKey
        );
        // this.props.dispatch(setAccount(account));
        wallet.setAccount(account);
      } catch (e) {
        const msg = String(e);
        if (msg.indexOf('SyntaxError') !== -1) {
          notification.error({
            message: t('input.error.keystore.invalid'),
            duration: 5,
          });
        } else if (msg.indexOf('derivation failed')) {
          notification.error({
            message: t('input.error.keystore.failed_to_derive'),
            duration: 5,
          });
        } else {
          notification.error({ message: String(e), duration: 5 });
        }
      }
    }
  };
  return (
    <>
      <CommonMarginComponent />
      <Form layout="vertical" form={form}>
        <p>{t('unlock_by_keystore_file.never_upload')}</p>
        <Keystore form={form} />
        <PasswordFormInputItem form={form} checkWeakPassword={false} />

        <Button htmlType="submit" onClick={unlockWallet} loading={isDecrypting}>
          {t('wallet.account.unlock')}
        </Button>
      </Form>
    </>
  );
};
