import { PlusOutlined, RetweetOutlined, SyncOutlined } from '@ant-design/icons';
import { Card, Col, Row, Tooltip } from 'antd';
import { Account } from 'iotex-antenna/lib/account/account';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { colors } from '../../../../constants/colors';
import { ICreateWalletState } from '../../../../interfaces/create-wallet.interface';
import { AccountMeta } from '../../../../models/account-meta';
import { useStore } from '../../../../stores';
import { ChainNetworkSwitchComponent } from '../../create-wallet/chain-network-swtich.component';
import { CustomTokenModalComponent } from '../custom-token-modal/custom-token-modal.component';
import { WalletRightBody } from './walllet-right-body.component';

export const WalletRightComponent = () => {
  const { wallet, lang } = useStore();
  const history = useHistory();
  const [state, setState] = useState<ICreateWalletState>({
    accountMeta: {} as AccountMeta,
    tokenInfos: {},
    customTokensFormVisible: false,
    accountCheckID: '',
    isLoading: false,
    isClaimingVita: false,
    isSyncing: false,
    claimConfirmationVisible: false,
    claimTokenAddress: '',
    authorizedMessageFormVisible: false,
    generateAuthMessageFormVisible: false,
    authMessage: null,
    bidConfirmationVisible: false,
    isBidding: false,
    bidFormModalVisible: false,
    bidAmount: '0',
    gasEstimation: null,
    claimable: false,
    claimableAmount: 0,
    showBalance: false,
  });
  /** Override partial of state */
  const deepSetter = (prop: Partial<ICreateWalletState>) =>
    setState({ ...state, ...prop });
  const onSyncAccount = () => {
    deepSetter({ isSyncing: true, isLoading: true });
    pollAccount();
  };
  const pollAccount = () => {};
  const onSwitchAccount = () => {
    wallet.setAccount({ account: {} as Account });
    history.push('/unlock');
  };

  return (
    <Card
      style={{ background: 'none' }}
      className="transform motion-reduce:transform-none hover:-translate-y-1 hover:scale-110 transition ease-in-out duration-300"
    >
      <div
        className="p-6 text-white"
        style={{
          backgroundColor: colors.primary,
          borderRadius: '5px 5px 0px 0px',
        }}
      >
        <Row className="pb-4 justify-between">
          <Col
            className="justify-between items-center flex cursor-pointer text-base cursor-pointer"
            onClick={onSwitchAccount}
          >
            <RetweetOutlined />
            {lang.t('account.switchAccount')}
          </Col>
          <Col
            className="justify-between items-center flex cursor-pointer text-base"
            onClick={() => deepSetter({ customTokensFormVisible: true })}
          >
            <PlusOutlined />
            {lang.t('account.token.addCustom')}
          </Col>
          <CustomTokenModalComponent
            onDestory={() => deepSetter({ customTokensFormVisible: false })}
            visible={state.customTokensFormVisible}
          />
        </Row>
        <Row className="pt-10">
          <Col xs={20}>
            <ChainNetworkSwitchComponent />
          </Col>
          <Col xs={4}>
            <Tooltip
              placement="top"
              trigger="hover"
              className="text-3xl"
              title={lang.t('account.refresh')}
            >
              <SyncOutlined
                spin={state.isSyncing}
                shape="circle"
                style={{
                  float: 'right',
                  lineHeight: '32px',
                  transform: 'rotate(-45deg)',
                }}
                onClick={onSyncAccount}
              ></SyncOutlined>
            </Tooltip>
          </Col>
        </Row>
        </div>
        <Row>
            <WalletRightBody />
        </Row>
    </Card>
  );
};
