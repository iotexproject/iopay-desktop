import { Input } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import { useStore } from '../../../../stores';

export const CustomTokenModalComponent = (props: { visible: boolean; onDestory: () => void }) => {
  const { lang } = useStore();
  const [form] = useForm();
  const [status, setStatus] = useState<'' | 'error' | 'success' | 'validating' | 'warning' | undefined>('error');
  const onChange = () => {
    const v = form.getFieldValue('xrc20');
    if (v.length === 41) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  };
  return (
    <Modal closable={true} visible={props.visible} centered={true} destroyOnClose={true} title={lang.t('account.token.addCustom')} onCancel={props.onDestory} onOk={props.onDestory}>
      <Form form={form} onValuesChange={onChange}>
        <FormItem validateStatus={status} name="xrc20" label={lang.t('wallet.input.fromXrc20')} rules={[{ required: true, len: 41, type: 'string' }]}>
          <Input />
        </FormItem>
      </Form>
    </Modal>
  );
};
