import { Button, Input } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Mnemonic from 'bitcore-mnemonic';
import React from 'react';
import { CommonMarginComponent, FormLabelComponent } from '../../../modules/stitches/component';
import { useStore } from '../../../stores';
import { getAntenna } from '../../../utils/get-antenna';

export const UnlockByMnemonicComponent = () => {
  const { wallet, lang } = useStore();
  const [form] = useForm();
  form.setFieldsValue({
    mnemonicPhrase: '',
  });

  const unlockWallet = () => {
     try {
      const antenna = getAntenna(true);
      const mnemonicPhrase = form.getFieldValue('mnemonicPhrase');
      const code = new Mnemonic(mnemonicPhrase);
      code.toString();
      const xpriv = code.toHDPrivateKey();
      const account = antenna.iotx.accounts.privateKeyToAccount(xpriv.privateKey.toString());
      wallet.setAccount({ account });
     } catch(err) {
       console.log(err);
     }
  };

  return (
    <>
      <CommonMarginComponent />
      <Form layout="vertical" form={form}>
        <FormItem
          label={<FormLabelComponent>{lang.t('input.error.mnemonic.label')}</FormLabelComponent>}
          rules={[
            {
              required: true,
              message: lang.t('input.error.mnemonic.invalid'),
            },
            {
              validator: (_, value, callback) => {
                value.trim().length === 0 || value.trim().split(' ').length === 12 ? callback() : callback(lang.t('input.error.mnemonic.length'));
              },
            },
          ]}
          name="mnemonicPhrase"
        >
          <Input autoComplete="off" className="form-input" placeholder={lang.t('input.error.mnemonic.placeholder')} name="mnemonicPhrase" />
        </FormItem>
        <Button type="primary" htmlType="submit" onClick={unlockWallet}>
          {lang.t('wallet.account.unlock')}
        </Button>
      </Form>
    </>
  );
};
