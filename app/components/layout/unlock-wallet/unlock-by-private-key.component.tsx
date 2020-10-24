import { EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Password from 'antd/lib/input/Password';
<<<<<<< Updated upstream
import React, { useState } from 'react';
=======
import React from 'react';
>>>>>>> Stashed changes
import { CommonMarginComponent, FormLabelComponent } from '../../../modules/stitches/component';
import { useStore } from '../../../stores';
import { getAntenna } from '../../../utils/get-antenna';

<<<<<<< Updated upstream
export const UnlockByPrivateKeyComponent = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [form] = useForm();
  const { lang, wallet } = useStore();
  const handleInputChange = (value) => {
    console.log(value);
    setPrivateKey({ ...value });
  };

  const unlockWallet = async () => {
    const errors = await form.validateFields();
    console.log(errors);
    if (!errors) {
      const antenna = getAntenna(true);
      const account = await antenna.iotx.accounts.privateKeyToAccount(privateKey);
      wallet.setAccount({ account });
    }
  };
  return (
    <>
      <CommonMarginComponent />
      <Form onValuesChange={(changeValues, values) => handleInputChange(values)} layout="vertical" form={form}>
=======
export const UnlocByPrivateKeyComponent = () => {
  const { lang, wallet } = useStore();
  const [form] = useForm();
  form.setFieldsValue({ privateKey: '' });

  const unlockWallet = () => {
    try {
      const privateKey = form.getFieldValue('privateKey');
      const antenna = getAntenna(true);
      const account = antenna.iotx.accounts.privateKeyToAccount(privateKey);
      wallet.setAccount({ account });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <CommonMarginComponent />
      <Form layout="vertical" form={form}>
>>>>>>> Stashed changes
        <FormItem
          rules={[
            {
              required: true,
              message: lang.t('input.error.private_key.invalid'),
            },
            {
              len: 64,
              message: lang.t('input.error.private_key.length'),
<<<<<<< Updated upstream
              type: 'string',
=======
>>>>>>> Stashed changes
            },
          ]}
          label={<FormLabelComponent>{lang.t('wallet.account.enterPrivateKey')}</FormLabelComponent>}
          name="privateKey"
        >
<<<<<<< Updated upstream
          <Password className="form-input" placeholder={lang.t('wallet.account.placehold.privateKey')} suffix={<EyeOutlined style={{ color: 'rgba(0,0,0,.45)' }} />} />
        </FormItem>
        <Button htmlType="submit" onClick={unlockWallet}>
=======
          <Password className="form-input" placeholder={lang.t('wallet.account.placehold.privateKey')} name="privateKey" suffix={<EyeOutlined style={{ color: 'rgba(0,0,0,.45)' }} />} />
        </FormItem>
        <Button type="primary" htmlType="submit" onClick={unlockWallet}>
>>>>>>> Stashed changes
          {lang.t('wallet.account.unlock')}
        </Button>
      </Form>
    </>
  );
};
