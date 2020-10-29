import { Input, notification } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Modal from 'antd/lib/modal/Modal';
import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { colors } from '../../../../../constants/colors';
import {
  IGenerateAuthorizedMessageFormProps,
  IGenerateAuthorizedMessageFormState,
} from '../../../../../interfaces/general-authorized-modal.interface';
import { FormLabelComponent } from '../../../../../modules/stitches/component';
import { useStore } from '../../../../../stores';
import { generateMessage } from '../../../../../utils/general-message';
import { CopyButtonClipboardComponent } from '../clipboard/clipboard.component';

export const GeneralAuthorizedModal = (
  props: IGenerateAuthorizedMessageFormProps
) => {
  const { lang, wallet } = useStore();
  const [form] = useForm();
  form.setFieldsValue({
    nonce: '',
  });
  const [state, setState] = useState<IGenerateAuthorizedMessageFormState>({
    confirming: false,
    authMessage: '',
    isGenerateActive: true,
  });
  const handleGenerate = (isActive: boolean) => {
    setState({ ...state, isGenerateActive: isActive });
  };
  const handleOk = async () => {
    try {
      const value = await form.validateFields(['nonce']);
      setState({
        ...state,
        authMessage: generateMessage(
          value.nonce,
          wallet.state.account!,
          props.token
        ),
      });
      handleGenerate(false);
    } catch (err) {
      notification.error({
        message: lang.t('Error!'),
        description: `${err.message}`,
        duration: 3,
      });
    }
  };

  return (
    <Modal
      title={lang.t('account.claimAs.generateAuthMessage')}
      visible={props.visible}
      onOk={() => handleOk()}
      onCancel={() => props.onClose()}
      okText={lang.t('account.claimAs.generate')}
      cancelText={lang.t('account.claimAs.close')}
      okButtonProps={{ disabled: !state.isGenerateActive }}
      confirmLoading={state.confirming}
      bodyStyle={{
        paddingTop: '0px !important',
      }}
    >
      <FormItem
        label={lang.t('wallet.input.nonce')}
        wrapperCol={{
          xs: 24,
        }}
        rules={[
          { required: true },
          {
            transform: (v) => new BigNumber(v),
            validator: (_, value, callback) => {
              if (value instanceof BigNumber && value.isInteger()) {
                callback();
              } else {
                callback(lang.t('wallet.error.number'));
              }
            },
          },
        ]}
      >
        <Input
          placeholder={'1'}
          style={{ width: '100%', background: colors.black10 }}
          name="nonce"
          onChange={() => handleGenerate(true)}
        />
      </FormItem>
      {state.authMessage && (
        <>
          <FormLabelComponent>
            {lang.t('account.claimAs.authMessage')}{' '}
            <CopyButtonClipboardComponent
              text={state.authMessage}
              size="small"
              icon="copy"
            />
            <textarea
              readOnly={true}
              style={{
                width: '100%',
                background: colors.black10,
                borderColor: colors.black60,
                margin: '10px 0px',
              }}
              value={state.authMessage}
              placeholder={''}
              rows={3}
            />
          </FormLabelComponent>
        </>
      )}
    </Modal>
  );
};
