import { WalletOutlined } from '@ant-design/icons';
import { Button, Form, Input, notification } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import BigNumber from 'bignumber.js';
import { fromRau, toRau } from 'iotex-antenna/lib/account/utils';
import React, { useState, useEffect } from 'react';
import { ContractFormormModel } from '../../../../interfaces/contract-form-modal.interface';
import { Token } from '../../../../models/token.model';
import { useStore } from '../../../../stores';
import { getAntenna } from '../../../../utils/get-antenna';
import {
  numberFromCommaString,
  numberWithCommas,
} from '../../../../utils/number-with-comma';
import { BroadcastFailureComponent } from '../broad-cast/broad-cast-failure.component';
import { BroadcastSuccessComponent } from '../broad-cast/broad-cast-success-component';
import { ConfirmContractModalComponent } from '../confirm-contract-modal/confirm-contract-modal.component';
import { AmountTypeComponent } from './amount-type.component';
import { useHistory } from 'react-router';

export const SendActionComponent = () => {
  const { lang, wallet } = useStore();
  const [form] = useForm<ContractFormormModel>();
  const history = useHistory();
  form.setFieldsValue({
    sendTo: undefined,
    amount: '1',
    gasPrice: '1',
    gasLimit: '200000',
    dataHex: 1234,
    gasCostLimit: 0.2,
  });
  const [state, setState] = useState({
    showDataHex: true,
    showTransferModal: false,
    gasCostLimit: form.getFieldValue('gasCostLimit'),
    broadcast: {} as { success: boolean },
    showBroadcast: false,
    txHash: '',
  });
  const onChoseTokenType = (tk: 'vita' | 'iotx') => {
    console.log(tk);
    setState({ ...state, showDataHex: tk === 'iotx' });
  };
  const sendTransfer = async () => {
    const antenna = getAntenna();
    const address = wallet.state.account?.address;
    const tokens = wallet.state.tokens;
    console.log(wallet.state);
    console.log(tokens);
    const errors = form.getFieldsError().reduce((acc, cur) => {
      if (cur.errors.length > 0) {
        acc.push(...cur.errors);
      }
      return acc;
    }, [] as string[]);
    if (!wallet.state.account || errors.length > 0) {
      setState({ ...state, showTransferModal: false });
      return;
    }
    const {
      sendTo: recipient,
      gasLimit,
      gasPrice,
      dataInHex,
      symbol,
      amount: amt,
    } = form.getFieldsValue();
    const amount = numberFromCommaString(amt);

    const customToken = (symbol as string)?.match(/iotx/)
      ? null
      : Token.getToken(symbol as string);

    const price = gasPrice ? toRau(gasPrice, 'Qev') : undefined;

    setState({ ...state, showTransferModal: false });
    let txHash = '';
    if (!customToken) {
      window.console.log(
        `antenna.iotx.sendTransfer(${JSON.stringify({
          from: address,
          to: recipient,
          value: toRau(amount, 'Iotx'),
          payload: dataInHex,
          gasLimit: gasLimit || undefined,
          gasPrice: price,
        })})`
      );

      try {
        txHash = await antenna.iotx.sendTransfer({
          from: wallet.state.account.address,
          to: form.getFieldValue('address'),
          value: toRau(amount, 'Iotx'),
          payload: form.getFieldValue('dataHex'),
          gasLimit,
          gasPrice: price,
        });
      } catch (error) {
        notification.error({
          message: `${error.message}`,
          duration: 3,
        });
      }
    } else {
      const tokenInfo = tokens[symbol as string];
      console.log(tokenInfo);
      const tokenAmount = new BigNumber(amount).multipliedBy(
        new BigNumber(`1e${tokenInfo?.decimals?.toNumber()}`)
      );
      const gasPriceRau = toRau(gasPrice, 'Qev');
      window.console.log(
        `customToken.transfer(
              ${recipient},
              ${tokenAmount.toFixed(0)},
              <account>,
              ${gasPriceRau},
              ${gasLimit}
            )`
      );
      try {
        txHash = await customToken.transfer(
          'sdasdhsakjdhashd',
          tokenAmount,
          wallet.state.account,
          gasPriceRau,
          gasLimit
        );
      } catch (error) {
        notification.error({
          message: `${error.message}`,
          duration: 3,
        });
      }
    }
    setState({
      ...state,
      broadcast: {
        success: Boolean(txHash),
      },
      showBroadcast: true,
      txHash,
    });
  };
  const isDisconnected = () => {
    return !navigator.onLine;
  };
  const showConfirmTransfer = () => {
    if (isDisconnected()) {
      notification.error({
        message: lang.t('network.disconnected'),
        duration: 5,
      });
      return;
    }
    const errors = form.getFieldsError().reduce((acc, cur) => {
      if (cur.errors.length > 0) {
        acc.push(...cur.errors);
      }
      return acc;
    }, [] as string[]);
    if (errors.length === 0) {
      setState({ ...state, showTransferModal: true });
    } else {
      notification.error({
        message: 'Please check form all of form fields valid!',
      });
    }
  };

  const onValuesChange = (v: any, value: ContractFormormModel) => {
    if (v?.gasPrice && v?.gasLimit) {
      const gasCostLimit = fromRau(
        `${Number(toRau(value.gasPrice, 'Qev')) * +value.gasLimit}`,
        'IoTx'
      );
      if (gasCostLimit !== state.gasCostLimit) {
        setState({ ...state, gasCostLimit });
      }
    }
  };

  const confirmContractOk = (status: boolean) => {
    setState({ ...state, showTransferModal: false });
    if (status) {
      sendTransfer();
    }
  };
  useEffect(() => {
    if (!wallet.state.account?.address) {
      history.push('/unlock')
    }
  });
  return (
    <>
      <Form form={form} onValuesChange={onValuesChange}>
        <FormItem
          label={lang.t('wallet.input.to')}
          name="sendTo"
          rules={[
            {
              type: 'string',
              message: 'IOTX address has to be of length 41',
              len: 41,
            },
            {
              required: true,
            },
          ]}
          initialValue={undefined}
        >
          <Input addonAfter={<WalletOutlined />} />
        </FormItem>
        <FormItem
          label={lang.t('action.amount')}
          name="amount"
          rules={[{ required: true }]}
        >
          <Input
            type="number"
            addonAfter={<AmountTypeComponent onChose={onChoseTokenType} />}
          />
        </FormItem>
        <FormItem
          label={lang.t('wallet.input.gasPrice')}
          name="gasPrice"
          rules={[
            {
              required: true,
              message: 'The gasPrice required!',
            },
          ]}
        >
          <Input type="number" />
        </FormItem>
        <FormItem
          label={lang.t('wallet.input.gasLimit')}
          name="gasLimit"
          rules={[{ required: true, message: 'GasLimit is required!' }]}
        >
          <Input />
        </FormItem>
        {state.showDataHex && (
          <FormItem
            label={lang.t('wallet.input.dib')}
            name="dataHex"
            rules={[{ required: true, message: 'dataHex is required!' }]}
          >
            <Input placeholder="1234" />
          </FormItem>
        )}
        <FormItem label={lang.t('wallet.input.gasCostLimit')}>
          <Input
            className="pointer-events-none"
            readOnly
            value={`${numberWithCommas(state.gasCostLimit)} IOTX`}
          />
        </FormItem>
      </Form>
      <Button type="primary" onClick={showConfirmTransfer}>
        {lang.t('wallet.transactions.send')}
      </Button>
      <ConfirmContractModalComponent
        dataSource={form.getFieldsValue()}
        confirmContractOk={confirmContractOk}
        showModal={state.showTransferModal}
      />

      {state.showBroadcast && state.showTransferModal ? (
        <>
          {state.broadcast?.success ? (
            <BroadcastSuccessComponent txHash={state.txHash} />
          ) : (
            <BroadcastFailureComponent
              suggestedMessage={lang.t('wallet.transfer.broadcast.fail', {
                token: lang.t('account.testnet.token'),
              })}
              errorMessage={''}
            />
          )}
          <Button onClick={() => setState({ ...state, showBroadcast: false })}>
            Send new
          </Button>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
