import { Button, Input } from "antd"
import Form, { useForm } from "antd/lib/form/Form"
import FormItem from "antd/lib/form/FormItem"
import Mnemonic from "bitcore-mnemonic"
import React, { useEffect } from "react"
import { useStore } from "../../store/index"
import { getAntenna, getAntennaUtils } from "../../utils/antenna"
import { useRouter } from "next/router"

export const UnlockByMnemonicComponent = () => {
  const router = useRouter()
  const { wallet, lang } = useStore()
  const [form] = useForm()

  useEffect(() => {
    form.setFieldsValue({
      mnemonicPhrase: "",
    })
  }, [])

  const unlockWallet = async () => {
    try {
      const antenna = getAntennaUtils()
      const mnemonicPhrase = form.getFieldValue("mnemonicPhrase")
      const code = new Mnemonic(mnemonicPhrase)
      code.toString()
      const xpriv = code.toHDPrivateKey()
      const account = antenna.privateKeyToAccount(xpriv.privateKey.toString())
      await wallet.setAccount({ account })
      router.push("/wallet")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <Form layout="vertical" form={form}>
        <FormItem
          label={lang.t("input.error.mnemonic.label")}
          rules={[
            {
              required: true,
              message: lang.t("input.error.mnemonic.invalid"),
            },
            {
              validator: (_, value, callback) => {
                value.trim().length === 0 || value.trim().split(" ").length === 12
                  ? callback()
                  : callback(lang.t("input.error.mnemonic.length"))
              },
            },
          ]}
          name="mnemonicPhrase"
        >
          <Input
            autoComplete="off"
            className="form-input"
            placeholder={lang.t("input.error.mnemonic.placeholder")}
            name="mnemonicPhrase"
          />
        </FormItem>
        <Button type="primary" htmlType="submit" onClick={unlockWallet}>
          {lang.t("wallet.account.unlock")}
        </Button>
      </Form>
    </>
  )
}
