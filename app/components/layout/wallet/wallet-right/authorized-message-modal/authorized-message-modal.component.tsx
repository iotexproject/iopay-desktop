import { useStore } from '../../../../../stores';
import { IAuthorizedMessageProps } from '../../../../../interfaces/authorized-message-modal.interface';
import React, { useState } from 'react';
import Modal from 'antd/lib/modal/Modal';
import { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { IAuthorizedMessage } from '../../../../../interfaces/authorized-message.interface';
import { notification } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { colors } from '../../../../../constants/colors';

export const AuthorizedMessageModal = (props: IAuthorizedMessageProps) => {
  const { lang } = useStore();
  const [form] = useForm();
  const [confirming, setConfirming] = useState(false);
  const handleOk = async () => {
    if (!props.onOK) {
      return;
    }
    setConfirming(true);
    try {
      const value = await form.validateFields(['authMessage']);
      const auth: IAuthorizedMessage = JSON.parse(value.authMessage);
      await props.onOK(auth);
      setConfirming(false);
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
      title={lang.t('account.claimAs')}
      visible={props.visible}
      onOk={async () => await handleOk()}
      onCancel={() => props.onCancel()}
      confirmLoading={confirming}
      bodyStyle={{
        paddingTop: '0px !important',
      }}
    >
      <FormItem
        label={lang.t('account.claimAs.authorizedMessage')}
        name="authMessage"
        wrapperCol={{
          xs: 24,
        }}
        rules={[{required: true}]}
      >
          <TextArea
            placeholder={lang.t('account.claimAs.authorizedTemplate')}
            style={{ width: '100%', background: colors.black10 }}
            name="authMessage"
            rows={7}
          />
        )}
      </FormItem>
    </Modal>
  );
};
