import Form from 'antd/lib/form';
import { useForm } from 'antd/lib/form/Form';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal';
import notification from 'antd/lib/notification';
import BigNumber from 'bignumber.js';
import { fromRau } from 'iotex-antenna/lib/account/utils';
import React, { useEffect, useState } from 'react';
import { colors } from '../../../../../constants/colors';
import {
  IBidFormProps,
  IBidFormState,
} from '../../../../../interfaces/bid-form-modal.interface';
import { Token } from '../../../../../models/token.model';
import { useStore } from '../../../../../stores';
import { numberWithCommas } from '../../../../../utils/number-with-comma';

export const BidFormModal = (props: IBidFormProps) => {
  const [state, setState] = useState<IBidFormState>({
    confirming: false,
    authMessage: '',
    maxBidAmount: '',
    initialValue: '1',
  });
  const {
    lang: { t },
    wallet: {
      state: { account },
    },
    base: { bidContractAddress },
  } = useStore();
  const pollMaxBidAmount = async () => {
    const maxBidAmount = await Token.getBiddingToken(
      bidContractAddress
    ).estimateMaxBidAmount(account!);
    if (state.maxBidAmount !== maxBidAmount) {
      setState({ ...state, maxBidAmount });
    }
    return maxBidAmount;
  };

  const handleOk = async () => {
    setState({ ...state, confirming: true });
    try {
      const value = await form.validateFields(['amount']);
      try {
        await props.onOK(value.amount);
      } catch (error) {
        notification.error({
          message: t('Error!'),
          description: `${error.message}`,
          duration: 3,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setState({ ...state, confirming: false });
    }
  };

  useEffect(() => {
    pollMaxBidAmount();
  });
  const [form] = useForm();
  const { onCancel, visible = false } = props;
  const { initialValue } = state;
  return (
    <Modal
      title={t('account.placeBid')}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={t('account.bid')}
      confirmLoading={state.confirming}
      bodyStyle={{
        paddingTop: '0px !important',
      }}
    >
      <Form form={form}>
        <Form.Item
          label={t('wallet.input.amount')}
          name="account"
          wrapperCol={{
            xs: 24,
          }}
          rules={[
            {
              validator: async (_, value: BigNumber, callback) => {
                const maxBidAmount = await pollMaxBidAmount();
                if (value.isGreaterThan(new BigNumber(maxBidAmount))) {
                  return callback(t('account.error.notEnoughBalance'));
                }
                callback();
              },
            },
          ]}
          initialValue={initialValue}
        >
          <div>
            <Input
              placeholder={initialValue}
              style={{ width: '100%', background: colors.black10 }}
              name="amount"
              addonAfter="IOTX"
            />
            {state.maxBidAmount && (
              <small>
                {t('account.availableForBid')}{' '}
                <strong
                  style={{ cursor: 'pointer' }}
                  role="main"
                  onClick={() => {
                    setState({
                      ...state,
                      initialValue: numberWithCommas(
                        fromRau(state.maxBidAmount, 'IoTx')
                      ),
                    });
                  }}
                >{`${
                  numberWithCommas(fromRau(state.maxBidAmount, 'IoTx')) || '0'
                } IOTX`}</strong>
              </small>
            )}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
