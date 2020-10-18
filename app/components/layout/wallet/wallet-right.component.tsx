import Icon, { SyncOutlined } from "@ant-design/icons";
import { Card, Col, Row, Tooltip } from "antd";
import React, { useState } from "react";
import { colors } from "../../../constants/colors";
import { ICreateWalletState } from "../../../interfaces/create-wallet.interface";
import { AccountMeta } from '../../../models/account-meta';
import { useStore } from "../../../stores";
import { ChainNetworkSwitchComponent } from "../create-wallet/chain-network-swtich.component";

export const WalletRightComponent = () => {

  const { wallet, lang } = useStore();
  const [state, setState] = useState<ICreateWalletState>({
    accountMeta: {} as AccountMeta,
    tokenInfos: {},
    customTokensFormVisible: false,
    accountCheckID: "",
    isLoading: false,
    isClaimingVita: false,
    isSyncing: false,
    claimConfirmationVisible: false,
    claimTokenAddress: "",
    authorizedMessageFormVisible: false,
    generateAuthMessageFormVisible: false,
    authMessage: null,
    bidConfirmationVisible: false,
    isBidding: false,
    bidFormModalVisible: false,
    bidAmount: "0",
    gasEstimation: null,
    claimable: false,
    claimableAmount: 0,
    showBalance: false
  });
  /** Override partial of state */
  const deepSetter = (prop: Partial<ICreateWalletState>) => setState({ ...state, ...prop });
  const onSyncAccount = () => {
    deepSetter({ isSyncing: true, isLoading: true });
    pollAccount();
  };
  const pollAccount = () => { };

  return <Card>
    <div
      className="p-6 text-white"
      style={{
        backgroundColor: colors.primary,
        borderRadius: "5px 5px 0px 0px"
      }}
    >
      <Row justify="space-between" align="middle" style={{ paddingBottom: 5 }}>
        <Col style={{ cursor: "pointer", fontSize: 13 }} onClick={() => wallet.setAccount()}>
          <Icon type="retweet" /> {lang.t("account.switchAccount")}
        </Col>
        <Col style={{ cursor: "pointer", fontSize: 13 }} onClick={() => deepSetter({ customTokensFormVisible: true })}>
          <Icon type="plus" /> {lang.t("account.token.addCustom")}
        </Col>
      </Row>
      <Row justify="space-between" align="middle" style={{ paddingTop: 10 }}>
        <Col xs={22}>
          <ChainNetworkSwitchComponent />
        </Col>
        <Col xs={2}>
          <Tooltip
            placement="top"
            trigger="hover"
            className="text-3xl"
            title={lang.t("account.refresh")}
          >
            <SyncOutlined
              spin={state.isSyncing}
              shape="circle"
              style={{
                float: "right",
                lineHeight: "32px",
                transform: "rotate(-45deg)",
              }}
              onClick={onSyncAccount}
            ></SyncOutlined>
          </Tooltip>
        </Col>
      </Row>
    </div>

  </Card>;
};
