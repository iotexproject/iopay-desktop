import { Button, notification } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Password from 'antd/lib/input/Password';
import { Account } from 'iotex-antenna/lib/account/account';
import { decrypt } from 'iotex-antenna/lib/account/wallet';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { IUnlockFormFields, ITokenInfoDict } from '../../../interfaces/wallet.interface';
import {
  CommonMarginComponent,
  FormLabelComponent
} from '../../../modules/stitches/component';
import { useStore } from '../../../stores';
import { getAntenna } from '../../../utils/get-antenna';
import { KeystoreComponent } from './key-store.component';
import { IRPCProvider } from '../../../interfaces/rpc-provider.interface';
import { xconf, XConfKeys } from '../../../models/xconf.enum';
import { Token } from '../../../models/token.model';

export const UnlockByKeystoreFileComponent = () => {
  const { wallet } = useStore();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [form] = useForm<IUnlockFormFields>();
  const history = useHistory();
  const { lang } = useStore();
  const getTokensInfo = async (account: Account, network: IRPCProvider) => {
    const accountCheckID = `${account && account.address}:${network && network.url}`;
    const defaultNetworkTokens = wallet.state.defaultNetworkTokens;
    if (!account) {
      return;
    }

    let tokenAddresses = xconf.getConf<Array<string>>(
      `${XConfKeys.TOKENS_ADDRS}_${accountCheckID}`,
      []
    );

    tokenAddresses = [...defaultNetworkTokens, ...tokenAddresses];
    const tokenInfos = await Promise.all(
      tokenAddresses.map((addr) =>
        Token.getToken(addr).getInfo(account.address)
      )
    );
    const newTokenInfos: ITokenInfoDict = {};
    tokenInfos.forEach((info) => {
      if (info && info.symbol) {
        newTokenInfos[info.tokenAddress] = info;
      }
    });
    // this.setState({ tokenInfos: newTokenInfos });
    console.log(`newTokenInfos`, newTokenInfos);
    wallet.state.tokens =  newTokenInfos;
  };
  const unlockWallet = () => {
    setIsDecrypting(true);
    // FIXME: if we do not wrapped code in setTimeout, the loading status is never shown, consider it's a bug from ANTD.
    setTimeout(() => {
      const values = form.getFieldsValue() as IUnlockFormFields;
      console.log(values);
      if (values && values?.password && values?.keystore) {
        const { password, keystore } = values;
        try {
          const { privateKey } = decrypt(keystore, password);
          const antenna = getAntenna(true);
          const account = antenna.iotx.accounts.privateKeyToAccount(privateKey);
          console.log(account);
          wallet.setAccount({ account });
          getTokensInfo(account, wallet.state.network as IRPCProvider);
          history.push('/wallet');
        } catch (e) {
          console.warn(e);
          const msg = String(e);
          if (msg.indexOf('SyntaxError') !== -1) {
            notification.error({
              message: lang.t('input.error.keystore.invalid'),
              duration: 5,
            });
          } else if (msg.indexOf('derivation failed')) {
            notification.error({
              message: lang.t('input.error.keystore.failed_to_derive'),
              duration: 5,
            });
          } else {
            notification.error({ message: String(e), duration: 5 });
          }
        } finally {
          setIsDecrypting(false);
        }
      } else {
        setIsDecrypting(false);
      }
    }, 50);
  };

  const setFormFiled = (obj: Partial<IUnlockFormFields>) => {
    const values = form.getFieldsValue();
    form.setFieldsValue({ ...values, ...obj });
  };

  const onInput = (ev) => setFormFiled({ password: ev.target.value });

  return (
    <>
      <CommonMarginComponent />
      <Form
        layout="vertical"
        form={form}
        initialValues={{ password: '', keystore: {} }}
      >
        <p>{lang.t('unlock_by_keystore_file.never_upload')}</p>
        <FormItem
          label={
            <FormLabelComponent>
              {lang.t('wallet.input.keystore')}
            </FormLabelComponent>
          }
          rules={[
            { required: true, message: lang.t('input.error.keystore.require') },
          ]}
          fieldKey="keystore"
          name="keystore"
          key="keystore"
        >
          <KeystoreComponent setFormFiled={setFormFiled} />
        </FormItem>
        <FormItem
          label={
            <FormLabelComponent>
              {lang.t('wallet.input.password')}
            </FormLabelComponent>
          }
          rules={[{ required: true }]}
          fieldKey="password"
          key="password"
          name="password"
        >
          <Password
            className="form-input"
            name="password"
            autoComplete="on"
            onInput={(ev) => onInput(ev)}
          />
        </FormItem>
        <Button
          type="primary"
          htmlType="submit"
          onClick={unlockWallet}
          disabled={isDecrypting}
          loading={isDecrypting}
        >
          {lang.t('wallet.account.unlock')}
        </Button>
      </Form>
    </>
  );
};
