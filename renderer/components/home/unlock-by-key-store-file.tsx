import { Button, notification } from "antd"
import Form, { useForm } from "antd/lib/form/Form"
import FormItem from "antd/lib/form/FormItem"
import Password from "antd/lib/input/Password"
import { decrypt } from "iotex-antenna/lib/account/wallet"
import React, { useState } from "react"

import { KeystoreComponent } from "./key-store.component"
import { useRouter } from "next/router"
import { getAntennaUtils } from "../../utils/antenna"
import { useStore } from "../../store/index"
import { IUnlockFormFields } from "../../interfaces/wallet.interface"
import { observer } from "mobx-react-lite"

export const UnlockByKeystoreFileComponent = observer(() => {
  const { wallet, lang } = useStore()
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [form] = useForm<IUnlockFormFields>()
  const router = useRouter()

  const unlockWallet = () => {
    setIsDecrypting(true)
    // FIXME: if we do not wrapped code in setTimeout, the loading status is never shown, consider it's a bug from ANTD.
    setTimeout(() => {
      const values = form.getFieldsValue() as IUnlockFormFields
      console.log(values)
      if (values && values?.password && values?.keystore) {
        const { password, keystore } = values
        try {
          const { privateKey } = decrypt(keystore, password)
          const antenna = getAntennaUtils()
          const account = antenna.privateKeyToAccount(privateKey)
          wallet.addAccount({ account })

          router.push("/wallet")
        } catch (e) {
          console.warn(e)
          const msg = String(e)
          if (msg.indexOf("SyntaxError") !== -1) {
            notification.error({
              message: lang.t("input.error.keystore.invalid"),
              duration: 5,
            })
          } else if (msg.indexOf("derivation failed")) {
            notification.error({
              message: lang.t("input.error.keystore.failed_to_derive"),
              duration: 5,
            })
          } else {
            notification.error({ message: String(e), duration: 5 })
          }
        } finally {
          setIsDecrypting(false)
        }
      } else {
        setIsDecrypting(false)
      }
    }, 50)
  }

  const setFormFiled = (obj: Partial<IUnlockFormFields>) => {
    const values = form.getFieldsValue()
    form.setFieldsValue({ ...values, ...obj })
  }

  const onInput = (ev) => setFormFiled({ password: ev.target.value })

  return (
    <>
      <Form layout="vertical" form={form} initialValues={{ password: "", keystore: {} }}>
        <p>{lang.t("unlock_by_keystore_file.never_upload")}</p>
        <FormItem
          label={<label>{lang.t("wallet.input.keystore")}</label>}
          rules={[{ required: true, message: lang.t("input.error.keystore.require") }]}
          fieldKey="keystore"
          name="keystore"
          key="keystore"
        >
          <KeystoreComponent setFormFiled={setFormFiled} />
        </FormItem>
        <FormItem
          label={<label>{lang.t("wallet.input.password")}</label>}
          rules={[{ required: true }]}
          fieldKey="password"
          key="password"
          name="password"
        >
          <Password className="form-input" name="password" autoComplete="on" onInput={(ev) => onInput(ev)} />
        </FormItem>
        <Button type="primary" htmlType="submit" onClick={unlockWallet} disabled={isDecrypting} loading={isDecrypting}>
          {lang.t("wallet.account.unlock")}
        </Button>
      </Form>
    </>
  )
})
