import Icon from '@ant-design/icons';
import { Alert, Button, Card, Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Mnemonic from "bitcore-mnemonic";
import { useObserver } from 'mobx-react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { colors } from '../../../constants/colors';
import { CommonMarginComponent, FormLabelComponent } from '../../../modules/stitches/component';
import { useStore } from '../../../stores';
import { getAntenna } from '../../../utils/get-antenna';

export const CreateWalletComponent = () => {
  const { lang, wallet } = useStore();
  const code = new Mnemonic();
  const xpriv = code.toHDPrivateKey();
  const account = getAntenna().iotx.accounts.privateKeyToAccount(
    xpriv.privateKey.toString()
  );
  const history = useHistory();
  const [form] = useForm();

  const confirm = () => {
    wallet.setAccount({ account });
    history.push('/wallet');
  }
  return useObserver(() => {
    return (
      <>
        <Row>
          <Button size="small" type="primary" onClick={() => history.push('/unlock')}>
            {lang.t('new-wallet.cancel')}
          </Button>
        </Row>

        <Row>
          <Col className="p-4" xs={24} sm={24} md={12} lg={14} xl={14}>
            <h3 className="text-4xl">Wallet is created!</h3>
            <Form form={form}>
              <FormItem>
                <FormLabelComponent>Account address</FormLabelComponent>
                <Input value={account.address} />
              </FormItem>
              <h4>Save your <span style={{ color: colors.error }}>mnemonic phrase</span></h4>
              <FormItem>
                <FormLabelComponent>Mnemonic Phrase</FormLabelComponent>
                <Input type="password" value={code.toString()} />
              </FormItem>
              <h4>Save Your <span style={{ color: colors.error }}>keystore file</span></h4>
              <FormItem>
                <FormLabelComponent>Password</FormLabelComponent>
                <Input type="password" />
              </FormItem>
            </Form>

            <Row>
              <Button>Export Keystore File (UTC / JSON)</Button>
              <Button>
                <Icon type="qrcode" />
                  Show Private Key
                </Button>
            </Row>

            <CommonMarginComponent />

            <Alert
              message={
                <div className="message-body">
                  <p>
                    <strong>{lang.t("new-wallet.warn.do-not-lose")}</strong>{" "}
                    {lang.t("new-wallet.warn.cant-recover")}
                  </p>
                  <p>
                    <strong>{lang.t("new-wallet.warn.do-not-share")}</strong>{" "}
                    {lang.t("new-wallet.warn.stolen")}
                  </p>
                  <p>
                    <strong>{lang.t("new-wallet.warn.backup")}</strong>{" "}
                    {lang.t("new-wallet.warn.secure")}
                  </p>
                </div>
              }
              type="warning"
              closable={true}
              showIcon={true}
            />
            <CommonMarginComponent />
            <Button type="primary" onClick={confirm}>
              {lang.t("new-wallet.button.unlock")}
            </Button>
          </Col>
          <Col className="p-4" xs={24} sm={24} md={12} lg={10} xl={10}>
            <Card className="rounded">
              <div className="new-wallet-text">
                <p>
                  <strong>{lang.t("account.why")}</strong>
                </p>
                <p>{lang.t("account.save")}</p>
                <p>
                  <strong>{lang.t("account.pay-attention")}</strong>
                </p>
                <p>{lang.t("account.not-hold")}</p>
                <p>
                  {lang.t("account.protect")} <strong>{lang.t("account.responsible")}</strong>
                </p>
              </div>
            </Card>
          </Col>
        </Row>

      </>
    );
  });
};
