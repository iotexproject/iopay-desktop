import { Form, Input, Modal } from "antd";
import { useForm } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import React, { useState, useEffect } from "react";
import { colors } from "../../../constants/colors";
import { FormLabelComponent } from "../../../modules/stitches/component";
import { useStore } from "../../../stores";
import { IAddCustomRPCProp } from "../../../interfaces/add-custom-rpc.interface";


export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  },
  colon: false
};



export const AddCustomRpcFormModal = (prop: IAddCustomRPCProp) => {
  const [confirming] = useState(false);
  const [form] = useForm();
  const { lang, wallet } = useStore();
  const confirm = async () => {
    const values = form.getFieldsValue();
    console.log(values);
    const validate = await form.getFieldsError(['name', 'url']);
    console.log(validate);
    prop.onOk();
  };

  useEffect(() => {
    form.setFieldsValue({ name: '', url: '' });
  }, []);
  return (
    <Modal
      visible={prop.visible}
      title={lang.t("account.addCustomRPC")}
      onOk={confirm}
      onCancel={prop.onCancel}
      confirmLoading={confirming}
      bodyStyle={{
        paddingTop: "0px !important"
      }}
      destroyOnClose={true}
      getContainer={false}
    >
      <Form preserve={false} form={form}>
        <FormItem
          label={<FormLabelComponent>{lang.t("wallet.input.name")} </FormLabelComponent>}
          {...formItemLayout}
          rules={[{ required: true }]}>
          <Input
            placeholder={lang.t("account.rpc.nameHolder")}
            style={{ width: "100%", background: colors.black10 }}
            name="name"
          />
        </FormItem>
        <FormItem
          label={<FormLabelComponent>{lang.t("wallet.input.url")} </FormLabelComponent>}
          {...formItemLayout}
          rules={[{ required: true }]}
        >
          <Input
            placeholder="https://iotexscan.io/"
            style={{ width: "100%", background: colors.black10 }}
            name="url"
          />
        </FormItem>
      </Form>
    </Modal>
  );
}
