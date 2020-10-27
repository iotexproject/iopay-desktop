import { Button, notification } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Password from 'antd/lib/input/Password';
import { decrypt } from 'iotex-antenna/lib/account/wallet';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { IUnlockFormFields } from '../../../interfaces/wallet.interface';
import { CommonMarginComponent, FormLabelComponent } from '../../../modules/stitches/component';
import { useStore } from '../../../stores';
import { getAntenna } from '../../../utils/get-antenna';
import { KeystoreComponent } from './key-store.component';

export const UnlockByKeystoreFileComponent = () => {
  const { wallet } = useStore();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [form] = useForm<IUnlockFormFields>();
  const history = useHistory();
  const { lang } = useStore();
  const unlockWallet = () => {
    // setIsDecrypting(true);
    // FIXME: if we do not wrapped code in setTimeout, the loading status is never shown, consider it's a bug from ANTD.
    setTimeout(() => {
      const values = form.getFieldsValue() as IUnlockFormFields;
      console.log(values);
      if (values && values?.password && values?.keystore) {
        const { password, keystore } = values;
        try {
          const { privateKey } = decrypt(keystore, password);
          const antenna = getAntenna(true);
          const account = antenna.iotx.accounts.privateKeyToAccount(privateKey);
          console.log(account);
          wallet.setAccount({ account });
          history.push('/wallet');
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
        } finally {
          setIsDecrypting(false);
        }
      } else {
        setIsDecrypting(false);
      }
    }, 50);
  };

  const setFormFiled = (obj: Partial<IUnlockFormFields>) => {
    const values = form.getFieldsValue();
    form.setFieldsValue({ ...values, ...obj });
  };

  const onInput = (ev) => setFormFiled({ password: ev.target.value });


  return (
    <>
      <CommonMarginComponent />
      <Form layout="vertical" form={form} initialValues={{ password: '', keystore: {} }}>
        <p>{lang.t('unlock_by_keystore_file.never_upload')}</p>
        <FormItem
          label={<FormLabelComponent>{lang.t('wallet.input.keystore')}</FormLabelComponent>}
          rules={[{ required: true, message: lang.t('input.error.keystore.require') }]}
          fieldKey="keystore"
          name="keystore"
          key="keystore"
        >
          <KeystoreComponent setFormFiled={setFormFiled} />
        </FormItem>
        <FormItem label={<FormLabelComponent>{lang.t('wallet.input.password')}</FormLabelComponent>} rules={[{ required: true }]} fieldKey="password" key="password" name="password">
        <Password className="form-input" name="password" autoComplete="on" onInput={(ev) => onInput(ev)} />
        </FormItem>
        <Button type="primary" htmlType="submit" onClick={unlockWallet} disabled={isDecrypting} loading={isDecrypting}>
          {lang.t('wallet.account.unlock')}
        </Button>
      </Form>
    </>
  );
};
