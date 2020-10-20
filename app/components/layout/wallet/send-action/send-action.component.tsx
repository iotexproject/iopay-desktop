import { WalletOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { useStore } from '../../../../stores';

export const SendActionComponent = () => {
  const { lang } = useStore();
  // const updateGasCostLimit = () => {
  //   const { gasLimit, gasPrice } = form.getFieldsValue();
  //   if (!gasLimit || !gasPrice) {
  //     return;
  //   }
  //   const gasCostLimit = fromRau(`${Number(toRau(gasPrice, 'Qev')) * gasLimit}`, 'IoTx');
  //   if (gasCostLimit !== this.state.gasCostLimit) {
  //     this.setState({ gasCostLimit });
  //   }
  // };
  // const updateGasCostLimit = () => {
  //   const { gasLimit, gasPrice } = form.getFieldsValue();
  //   if (!gasLimit || !gasPrice) {
  //     return;
  //   }
  //   const gasCostLimit = fromRau(`${Number(toRau(gasPrice, 'Qev')) * gasLimit}`, 'IoTx');
  //   if (gasCostLimit !== this.state.gasCostLimit) {
  //     this.setState({ gasCostLimit });
  //   }
  // };
  return (
    <Form>
      <FormItem label={lang.t('wallet.input.to')} name="sendTo" rules={[{ required: true, type: 'string', message: 'IOTX address has to be of length 41', len: 41 }]} initialValue="">
        <Input addonAfter={<WalletOutlined />} />
      </FormItem>
      <FormItem label={lang.t('action.amount')} name="amount" rules={[{ required: true }]} initialValue={1}>
        <Input type="number" />
      </FormItem>
      <FormItem
        label={lang.t('wallet.input.gasPrice')}
        name="gasPrice"
        rules={[{ required: true, message: 'The gasPrice should be grather than or equal to 1.', type: 'number', min: 1 }]}
        initialValue={1}
      >
        <Input type="number" />
      </FormItem>
      <FormItem label={lang.t('wallet.input.gasLimit')} name="gasLimit" rules={[{ required: true, message: 'GasLimit is required!' }]} initialValue={200000}>
        <Input />
      </FormItem>
      <FormItem label={lang.t('wallet.input.dib')} name="dataHex" rules={[{ required: true, message: 'dataHex is required!' }]} initialValue="1234">
        <Input placeholder="1234" />
      </FormItem>
      <FormItem label={lang.t('wallet.input.gasCostLimit')} name="gasCostLimit" rules={[{ required: true, message: 'gasCostLimit is required!' }]} initialValue="0.2 IOTEX">
        <Input className="pointer-events-none" readOnly />
      </FormItem>
    </Form>
  );
};
