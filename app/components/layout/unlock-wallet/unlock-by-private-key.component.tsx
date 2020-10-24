import { EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Password from 'antd/lib/input/Password';
import React, { useState } from 'react';
import { CommonMarginComponent, FormLabelComponent } from '../../../modules/stitches/component';
import { useStore } from '../../../stores';
import { getAntenna } from '../../../utils/get-antenna';

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
        <FormItem
          rules={[
            {
              required: true,
              message: lang.t('input.error.private_key.invalid'),
            },
            {
              len: 64,
              message: lang.t('input.error.private_key.length'),
              type: 'string',
            },
          ]}
          label={<FormLabelComponent>{lang.t('wallet.account.enterPrivateKey')}</FormLabelComponent>}
          name="privateKey"
        >
          <Password className="form-input" placeholder={lang.t('wallet.account.placehold.privateKey')} suffix={<EyeOutlined style={{ color: 'rgba(0,0,0,.45)' }} />} />
        </FormItem>
        <Button htmlType="submit" onClick={unlockWallet}>
          {lang.t('wallet.account.unlock')}
        </Button>
      </Form>
    </>
  );
};
