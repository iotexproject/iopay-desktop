/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
import Icon from '@ant-design/icons';
import { Button, Dropdown, Form, Menu, notification, Tag } from 'antd';
import Upload, { RcFile } from 'antd/lib/upload';
import isElectron from 'is-electron';
import { t } from 'onefx/lib/iso-i18n';
import React from 'react';
import {
  KeystoreProps,
  KeystoreState,
} from '../../../interfaces/unlock-by-key-store-file.interface';
import { xconf, XConfKeys } from '../../../models/xconf.enum';
import { FormLabelComponent } from '../../share/share.component';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;

window.xconf = xconf;

export class Keystore extends React.Component<KeystoreProps, KeystoreState> {
  constructor(props: KeystoreProps) {
    super(props);
    this.state = {
      keystores: xconf.getConf(XConfKeys.KEYSTORES, {}),
      keyname: xconf.getConf(XConfKeys.LAST_USED_KEYSTORE_NAME, ''),
    };
  }

  public componentDidMount(): void {
    const { keyname } = this.state;
    if (keyname) {
      this.selectKeystore(keyname);
    }
  }

  public readFileStore = (file: RcFile) => {
    const { keystores } = this.state;
    const reader = new FileReader();
    // Safe check for the file size. It should be < 10KB.
    if (file.size > 10 * 1024) {
      notification.error({
        message: t('input.error.keystore.invalid'),
        duration: 5,
      });
      return false;
    }
    reader.onload = () => {
      try {
        const result = `${reader.result}`;
        if (JSON.parse(result)) {
          keystores[file.name] = result;
          // Update keystores list
          xconf.setConf(XConfKeys.KEYSTORES, keystores);
          // Update component state
          this.setState({
            keystores: {
              ...keystores,
            },
          });
          // Select current file store.
          this.selectKeystore(file.name);
        } else {
          throw new Error(t('input.error.keystore.invalid'));
        }
      } catch (e) {
        notification.error({
          message: t('input.error.keystore.invalid'),
          duration: 5,
        });
      }
    };
    reader.readAsText(file);
    return false;
  };

  public renderKeystoreMenu(): JSX.Element {
    const { keystores } = this.state;
    const keystoresList = Object.keys(keystores);
    const uploadProps = {
      beforeUpload: this.readFileStore,
      showUploadList: false,
      accept: '.json,application/json,text/json',
    };

    if (!keystoresList.length || !isElectron()) {
      return (
        <Upload {...uploadProps}>
          <Button>
            <Icon type="key" />
            {t('unlock_by_keystore_file.browse_file')}
          </Button>
        </Upload>
      );
    }

    const menu = (
      <Menu>
        {keystoresList.map((name, i) => (
          <Menu.Item
            key={i}
            onClick={() => this.selectKeystore(name)}
            style={{ textAlign: 'right' }}
          >
            <Tag
              onClose={() => this.deleteKeystore(name)}
              // eslint-disable-next-line react/jsx-boolean-value
              closable={true}
              className="keystore-tag"
            >
              {name}
            </Tag>
          </Menu.Item>
        ))}
        <Menu.Item>
          <Upload {...uploadProps}>
            <Icon type="key" />
            {t('unlock_by_keystore_file.browse_file')}
          </Upload>
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu}>
        <Button>
          {t('unlock_by_keystore_file.select_file')}
          <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }

  public selectKeystore(keyname: string): boolean {
    const keystores = xconf.getConf<{ [index: string]: string }>(
      XConfKeys.KEYSTORES,
      {}
    );
    if (keystores[keyname]) {
      this.setState({ keyname });
      this.props.setFormFiled({ keystore: this.state.keystores[keyname] } as {
        [key: string]: string;
      });
      xconf.setConf(XConfKeys.LAST_USED_KEYSTORE_NAME, keyname);
    }
    return true;
  }

  public deleteKeystore(keyname: string): boolean {
    const { keystores } = this.state;
    const newKeystores: { [index: string]: string } = {};
    Object.keys(keystores).forEach((name) => {
      if (name !== keyname) {
        newKeystores[name] = keystores[name];
      }
    });
    if (keyname === this.state.keyname) {
      this.clearSelected();
    }
    this.setState({ keystores: newKeystores });
    // Update keystores list
    xconf.setConf(XConfKeys.KEYSTORES, newKeystores);
    return true;
  }

  public clearSelected = () => {
    this.props.setFormFiled({ keystore: '' } as {
      [key: string]: string;
    });
    // Clear remember for last keystore used also.
    xconf.setConf(XConfKeys.LAST_USED_KEYSTORE_NAME, '');
    this.setState({ keyname: '' });
  };

  public render(): JSX.Element {
    const { keyname } = this.state;
    return (
      <Form.Item
        label={
          <FormLabelComponent>{t('wallet.input.keystore')}</FormLabelComponent>
        }
        rules={[{ required: true, message: t('input.error.keystore.require') }]}
        fieldKey="keystore"
        key="keystore"
      >
        {this.renderKeystoreMenu()}
        <div>
          {keyname ? (
            <Tag
              onClose={this.clearSelected}
              closable={true}
              className="keystore-tag"
              style={{
                marginTop: 5,
              }}
            >
              <Icon type="file" />
              {keyname}
            </Tag>
          ) : null}
        </div>
      </Form.Item>
    );
  }
}
