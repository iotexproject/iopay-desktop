import { Button, notification } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Password from 'antd/lib/input/Password';
import { decrypt } from 'iotex-antenna/lib/account/wallet';
import React, { useState } from 'react';
import { IUnlockFormFields } from '../../../interfaces/wallet.interface';
import { useStore } from '../../../stores';
import { getAntenna } from '../../../utils/get-antenna';
import { CommonMarginComponent, FormLabelComponent } from '../../../modules/stitches/component';
import { KeystoreComponent } from './key-store.component';

export const UnlockByKeystoreFileComponent = () => {
  const { wallet } = useStore();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [form] = useForm<IUnlockFormFields>();
  const checkWeakPassword = false;
  const { lang } = useStore();

  const unlockWallet = async () => {
    setIsDecrypting(true);
    const values = form.getFieldsValue(['password', 'keystore']) as IUnlockFormFields;
    if (values && values?.password && values?.keystore) {
      const { password, keystore } = values;
      try {
        const { privateKey } = decrypt(keystore, password);
        const antenna = getAntenna(true);
        const account = await antenna.iotx.accounts.privateKeyToAccount(privateKey);
        wallet.setAccount({ account });
      } catch (e) {
        console.warn(e);
        const msg = String(e);
        if (msg.indexOf('SyntaxError') !== -1) {
          notification.error({
            message: lang.t('input.error.keystore.invalid'),
            duration: 5,
          });
        } else if (msg.indexOf('derivation failed')) {
          notification.error({
            message: lang.t('input.error.keystore.failed_to_derive'),
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
      <Form layout="vertical" form={form} initialValues={{ password: '', keystore: {} }}>
        <p>{lang.t('unlock_by_keystore_file.never_upload')}</p>
        <KeystoreComponent setFormFiled={setFormFiled} />
        <FormItem
          label={<FormLabelComponent>{lang.t('wallet.input.password')}</FormLabelComponent>}
          rules={[checkWeakPassword ? { required: true, min: 6 } : { required: true }]}
          fieldKey="password"
          key="password"
        >
          <Password className="form-input" name="password" autoComplete="on" onInput={(ev) => onInput(ev)} />
        </FormItem>
        <Button htmlType="submit" onClick={unlockWallet} disabled={isDecrypting} loading={isDecrypting}>
          {lang.t('wallet.account.unlock')}
        </Button>
      </Form>
    </>
  );
};
