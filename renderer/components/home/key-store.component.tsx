import Icon from "@ant-design/icons"
import { Button, Dropdown, Menu, notification, Tag } from "antd"
import Upload, { RcFile } from "antd/lib/upload"
import { PrivateKey } from "iotex-antenna/lib/account/wallet"
import isElectron from "is-electron"
import { useLocalStore, useObserver } from "mobx-react-lite"
import React, { useEffect } from "react"
import { useStore } from "../../store/index"

declare const window: any

export const KeystoreComponent = (props: { setFormFiled: (param: Pick<any, "keystore">) => void }) => {
  const { lang } = useStore()
  const store = useLocalStore(() => ({
    keystores: {},
    keyname: "",
    clearSelected: () => {
      props.setFormFiled({ keystore: {} as PrivateKey })
      // Clear remember for last keystore used also.
      store.keyname = ""
    },
    deleteKeystore(keyname: string): boolean {
      const { keystores } = store
      const newKeystores = {} as PrivateKey
      Object.keys(keystores).forEach((name) => {
        if (name !== keyname) {
          newKeystores[name] = keystores[name]
        }
      })
      if (keyname === store.keyname) {
        this.clearSelected()
      }
      store.keystores = newKeystores
      // Update keystores list
      // xconf.setConf<PrivateKey>(XConfKeys.KEYSTORES, newKeystores);
      return true
    },
    selectKeystore(keyname: string) {
      const keystores = store.keystores
      if (keystores[keyname]) {
        store.keyname = keyname
        props.setFormFiled({ keystore: JSON.parse(store.keystores[keyname]) as PrivateKey })
        // xconf.setConf(XConfKeys.LAST_USED_KEYSTORE_NAME, keyname);
      }
    },
    readFileStore: (file: RcFile) => {
      const { keystores } = store
      const reader = new FileReader()
      // Safe check for the file size. It should be < 10KB.
      if (file.size > 10 * 1024) {
        notification.error({
          message: lang.t("input.error.keystore.invalid"),
          duration: 5,
        })
        return false
      }
      reader.onload = () => {
        try {
          const result = `${reader.result}`
          if (JSON.parse(result)) {
            keystores[file.name] = result
            // Update keystores list
            // xconf.setConf(XConfKeys.KEYSTORES, keystores);
            // Update component state
            store.keystores = keystores

            // Select current file store.
            store.selectKeystore(file.name)
            props.setFormFiled({ keystore: JSON.parse(store.keystores[file.name]) as PrivateKey })
          } else {
            throw new Error(lang.t("input.error.keystore.invalid"))
          }
        } catch (e) {
          notification.error({
            message: lang.t("input.error.keystore.invalid"),
            duration: 5,
          })
        }
      }
      reader.readAsText(file)
      return false
    },
  }))
  // Init default selected file from localstorage.
  useEffect(() => {
    const { keyname } = store
    if (keyname) {
      store.selectKeystore(keyname)
    }
  }, [store.keyname])
  const renderKeystoreMenu = () => {
    const { keystores } = store
    const keystoresList = Object.keys(keystores)
    const uploadProps = {
      beforeUpload: store.readFileStore,
      showUploadList: false,
      accept: ".json,application/json,text/json",
    }

    if (!keystoresList.length || !isElectron()) {
      return (
        // FIXME: Listen the file change, and emit data to parent component.
        <Upload {...uploadProps}>
          <Button>
            <Icon type="key" />
            {lang.t("unlock_by_keystore_file.browse_file")}
          </Button>
        </Upload>
      )
    }

    const menu = (
      <Menu>
        {keystoresList.map((name, i) => (
          <Menu.Item key={i} onClick={() => store.selectKeystore(name)} style={{ textAlign: "right" }}>
            <Tag onClose={() => store.deleteKeystore(name)} closable={true} className="keystore-tag">
              {name}
            </Tag>
          </Menu.Item>
        ))}
        <Menu.Item>
          <Upload {...uploadProps}>
            <Icon type="key" />
            {lang.t("unlock_by_keystore_file.browse_file")}
          </Upload>
        </Menu.Item>
      </Menu>
    )

    return (
      <Dropdown overlay={menu}>
        <Button>
          {lang.t("unlock_by_keystore_file.select_file")}
          <Icon type="down" />
        </Button>
      </Dropdown>
    )
  }

  return useObserver(() => (
    <>
      {renderKeystoreMenu()}
      <div>
        {store.keyname ? (
          <Tag
            onClose={store.clearSelected}
            closable={true}
            className="keystore-tag"
            style={{
              marginTop: 5,
            }}
          >
            <Icon type="file" />
            {store.keyname}
          </Tag>
        ) : null}
      </div>
    </>
  ))
}
