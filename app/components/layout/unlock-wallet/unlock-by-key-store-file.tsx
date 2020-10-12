/* eslint-disable react/jsx-curly-newline */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import { Button, notification } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Password from 'antd/lib/input/Password';
import { decrypt } from 'iotex-antenna/lib/account/wallet';
import { t } from 'onefx/lib/iso-i18n';
import React, { useState } from 'react';
import { IUnlockFormFields } from '../../../interfaces/wallet.interface';
import { useStore } from '../../../stores';
import { getAntenna } from '../../../utils/get-antenna';
import {
  CommonMarginComponent,
  FormLabelComponent,
} from '../../share/share.component';
import { Keystore } from './key-store.component';

export const UnlockByKeystoreFileComponent = () => {
  const { wallet } = useStore();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [form] = useForm<IUnlockFormFields>();
  const checkWeakPassword = false;

  const unlockWallet = async () => {
    setIsDecrypting(true);
    const values = form.getFieldsValue(['password', 'keystore']);
    if (values && values?.password && values?.keystore) {
      const { password, keystore } = values;
      try {
        const keyObj = JSON.parse(keystore);
        const { privateKey } = decrypt(keyObj, password);
        const antenna = getAntenna(true);
        const account = await antenna.iotx.accounts.privateKeyToAccount(
          privateKey
        );
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
    setIsDecrypting(false);
  };

  const setFormFiled = async (obj: Partial<IUnlockFormFields>) => {
    const values = form.getFieldsValue(['password', 'keystore']);
    form.setFieldsValue({ ...values, ...obj });
  };

  const onInput = (ev) => setFormFiled({ password: ev.target.value });
  return (
    <>
      <CommonMarginComponent />
      <Form
        layout="vertical"
        form={form}
        initialValues={{ password: '', keystore: {} }}
      >
        <p>{t('unlock_by_keystore_file.never_upload')}</p>
        <Keystore setFormFiled={setFormFiled} />
        <FormItem
          label={
            <FormLabelComponent>
              {t('wallet.input.password')}
            </FormLabelComponent>
          }
          rules={[
            checkWeakPassword ? { required: true, min: 6 } : { required: true },
          ]}
          fieldKey="password"
          key="password"
        >
          <Password
            className="form-input"
            name="password"
            autoComplete="on"
            onInput={(ev) => onInput(ev)}
          />
        </FormItem>
        <Button
          htmlType="submit"
          onClick={unlockWallet}
          disabled={isDecrypting}
          loading={isDecrypting}
        >
          {t('wallet.account.unlock')}
        </Button>
      </Form>
    </>
  );
};
