import { Input } from 'antd';
import Form from 'antd/lib/form';
import { t } from 'onefx/lib/iso-i18n';
import React from 'react';
import { IPasswordFormInputProp } from '../../../interfaces/wallet.interface';
import { FormLabelComponent } from '../../share/share.component';

export const PasswordFormInputItem = (prop: IPasswordFormInputProp) => {
  const { initialValue, checkWeakPassword, setFormFiled } = prop;
  const onInput = (ev) => {
    setFormFiled({ password: ev.target.value });
  };
  return (
    <Form.Item
      label={
        <FormLabelComponent>{t('wallet.input.password')}</FormLabelComponent>
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
