import { WalletOutlined } from '@ant-design/icons';
import { Form, Input, Button } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { useState } from 'react';
import { useStore } from '../../../../stores';
import { AmountTypeComponent } from './amount-type.component';

export const SendActionComponent = () => {
  const { lang } = useStore();
  const [state, setState] = useState({
    showDataHex: true,
  });
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
  const onChoseTokenType = (tk: 'vita' | 'iotx') => {
    console.log(tk);
    setState({ ...state, showDataHex: tk === 'iotx' });
  };
  return (
    <>
      <Form>
        <FormItem label={lang.t('wallet.input.to')} name="sendTo" rules={[{ required: true, type: 'string', message: 'IOTX address has to be of length 41', len: 41 }]} initialValue="">
          <Input addonAfter={<WalletOutlined />} />
        </FormItem>
        <FormItem label={lang.t('action.amount')} name="amount" rules={[{ required: true }]} initialValue={1}>
          <Input type="number" addonAfter={<AmountTypeComponent onChose={onChoseTokenType} />} />
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
        {state.showDataHex && (
          <FormItem label={lang.t('wallet.input.dib')} name="dataHex" rules={[{ required: true, message: 'dataHex is required!' }]} initialValue="1234">
            <Input placeholder="1234" />
          </FormItem>
        )}
        <FormItem label={lang.t('wallet.input.gasCostLimit')} name="gasCostLimit" rules={[{ required: true, message: 'gasCostLimit is required!' }]} initialValue="0.2 IOTEX">
          <Input className="pointer-events-none" readOnly />
        </FormItem>
      </Form>
      <Button type="primary">{lang.t('wallet.transactions.send')}</Button>
    </>
  );
};
