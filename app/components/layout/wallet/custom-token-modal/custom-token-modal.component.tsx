import { Input } from 'antd';
import Form from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import { useStore } from '../../../../stores';

export const CustomTokenModalComponent = (props: { visible: boolean; onDestory: () => void }) => {
  const { lang } = useStore();
  return (
    <Modal
       closable={true}
       visible={props.visible}
       centered={true}
       destroyOnClose={true}
       title={lang.t('account.token.addCustom')}
       onCancel={props.onDestory}
       onOk={props.onDestory}>
      <Form>
        <FormItem name="xrc20" label={lang.t('wallet.input.fromXrc20')} rules={[{ required: true, len: 41, type: 'string' }]}>
          <Input />
        </FormItem>
      </Form>
    </Modal>
  );
};
