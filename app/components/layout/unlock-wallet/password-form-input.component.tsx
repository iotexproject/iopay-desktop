import { Input } from 'antd';
import Form from 'antd/lib/form';
import React from 'react';
import { FormLabelComponent } from '../../../modules/stitches/component';
import { IPasswordFormInputProp } from '../../../interfaces/wallet.interface';
import { useStore } from '../../../stores/index';

export const PasswordFormInputItem = (prop: IPasswordFormInputProp) => {
  const { initialValue, checkWeakPassword, setFormFiled } = prop;
  const {lang} = useStore()
  const onInput = (ev) => {
    setFormFiled({ password: ev.target.value });
  };
  return (
    <Form.Item
      label={
        <FormLabelComponent>{lang.t('wallet.input.password')}</FormLabelComponent>
      }
      rules={[
        checkWeakPassword ? { required: true, min: 6 } : { required: true },
      ]}
      fieldKey="password"
      key="password"
    >
      <Input.Password
        className="form-input"
        name="password"
        autoComplete="on"
        value={initialValue}
        onInput={onInput}
      />
    </Form.Item>
  );
};
