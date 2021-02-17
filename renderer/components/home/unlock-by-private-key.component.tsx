import { EyeOutlined } from "@ant-design/icons"
import { Button } from "antd"
import Form, { useForm } from "antd/lib/form/Form"
import FormItem from "antd/lib/form/FormItem"
import Password from "antd/lib/input/Password"
import React, { useState } from "react"
import { useStore } from "../../store/index"
import { getAntenna, getAntennaUtils } from "../../utils/antenna"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { observer } from "mobx-react-lite"

export const UnlockByPrivateKeyComponent = observer(() => {
  const [form] = useForm()
  const { lang, wallet } = useStore()
  const unlockWallet = async () => {
    form
      .validateFields()
      .then(async ({ privateKey }) => {
        const antenna = getAntennaUtils()
        const account = await antenna.privateKeyToAccount(privateKey)
        wallet.addAccount({ account })
      })
      .catch(console.log)
  }

  useEffect(() => {
    form.setFieldsValue({
      privateKey: "",
    })
  }, [])
  return (
    <>
      <Form layout="vertical" form={form}>
        <FormItem
          rules={[
            {
              required: true,
              message: lang.t("input.error.private_key.invalid"),
            },
            {
              len: 64,
              message: lang.t("input.error.private_key.length"),
              type: "string",
            },
          ]}
          label={<label>{lang.t("wallet.account.enterPrivateKey")}</label>}
          name="privateKey"
        >
          <Password
            className="form-input"
            placeholder={lang.t("wallet.account.placehold.privateKey")}
            suffix={<EyeOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
          />
        </FormItem>
        <Button htmlType="submit" onClick={unlockWallet}>
          {lang.t("wallet.account.unlock")}
        </Button>
      </Form>
    </>
  )
})
