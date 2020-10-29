import { EyeOutlined } from '@ant-design/icons';
import { Badge, Button, Dropdown, Menu, notification, Row } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import BigNumber from 'bignumber.js';
import { shell } from 'electron';
import { Account } from 'iotex-antenna/lib/account/account';
import { fromRau } from 'iotex-antenna/lib/account/utils';
import { IAccountMeta } from 'iotex-antenna/lib/rpc-method/types';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { colors } from '../../../../constants/colors';
import { DISCORD_URL, VOTING_URL } from '../../../../constants/url';
import { IAuthorizedMessage } from '../../../../interfaces/authorized-message.interface';
import { IGasEstimation } from '../../../../interfaces/gas-estimation.interface';
import {
  ITokenInfo,
  ITokenInfoDict,
} from '../../../../interfaces/wallet.interface';
import { TokenType } from '../../../../models/token-type.enum';
import { Token } from '../../../../models/token.model';
import { xconf, XConfKeys } from '../../../../models/xconf.enum';
import { useStore } from '../../../../stores';
import { onElectronClick } from '../../../../utils/electron-click';
import { getAntenna } from '../../../../utils/get-antenna';
import { toPrecisionFloor } from '../../../../utils/number-with-comma';
import { ConfirmContractModalComponent } from '../confirm-contract-modal/confirm-contract-modal.component';
import { AuthorizedMessageModal } from './authorized-message-modal/authorized-message-modal.component';
import { BidFormModal } from './bid-form-modal/bid-form-modal.component';
import { GeneralAuthorizedModal } from './general-authorized-modal/general-authorized-modal.component';

export const WalletRightBody = () => {
  const [state, setState] = useState({
    showBalance: false,
    IOTXBalance: '',
    VITABalance: '',
    accountMeta: {} as IAccountMeta | undefined,
    tokenInfos: {} as ITokenInfoDict,
    accountCheckID: '',
    bidFormModalVisible: false,
    bidConfirmationVisible: false,
    bidAmount: '0',
    gasEstimation: null as IGasEstimation | null,
    claimable: false,
    claimableAmount: 0,
    customTokensFormVisible: false,
    isLoading: false,
    isClaimingVita: false,
    isSyncing: false,
    claimConfirmationVisible: false,
    claimTokenAddress: '',
    authorizedMessageFormVisible: false,
    generateAuthMessageFormVisible: false,
    authMessage: null as IAuthorizedMessage | null,
    isBidding: false,
  });
  const history = useHistory();
  const { lang, wallet, base } = useStore();
  const { account } = wallet.state;
  const getTagClassName = (): string => {
    return !state.claimable ? 'ant-btn disabled' : 'ant-btn';
  };

  const renderBidFormModal = () => {
    const { account } = wallet.state;
    const { bidContractAddress } = base;
    if (!account) {
      return null;
    }
    return (
      <BidFormModal
        visible={state.bidFormModalVisible}
        onOK={async (amount: string) => {
          try {
            const gasEstimation = await Token.getBiddingToken(
              bidContractAddress
            ).estimateBidGas(account, amount);
            setState({
              ...state,
              bidFormModalVisible: false,
              bidConfirmationVisible: true,
              bidAmount: amount,
              gasEstimation,
            });
          } catch (error) {
            notification.error({ message: error.message });
          }
        }}
        onCancel={() => {
          setState({ ...state, bidFormModalVisible: false });
        }}
      />
    );
  };
  const renderSymbol = (symbol: string, href: string, linkName: string) => {
    const { lang } = useStore();
    return (
      <>
        <Row>{symbol}</Row>
        <Row>
          <a
            href={href}
            style={{ marginRight: 4, cursor: 'pointer' }}
            target="_blank noopener noreferer"
            onClick={() => onElectronClick(href)}
          >
            {lang.t(linkName)}
          </a>
        </Row>
      </>
    );
  };
  const renderClaimButton = () => {
    const token = getToken(TokenType.VITA)!;
    const claimMenu = (
      <Menu>
        <MenuItem
          key="claimAs"
          onClick={() =>
            setState({ ...state, authorizedMessageFormVisible: true })
          }
        >
          {lang.t('account.claimAs')}
        </MenuItem>
        <MenuItem
          key="generateAuthMessage"
          onClick={() => {
            setState({ ...state, generateAuthMessageFormVisible: true });
          }}
        >
          {lang.t('account.claimAs.generateAuthMessage')}
        </MenuItem>
      </Menu>
    );

    return (
      <Badge count={state.claimableAmount}>
        <Dropdown.Button
          overlay={claimMenu}
          className="claimButton"
          trigger={['click', 'hover']}
        >
          {
            // @ts-ignore
            <a
              type="primary"
              style={{
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4,
                boxShadow: 'none',
              }}
              onClick={() => onClaimClickHandle(token)}
              className={getTagClassName()}
              href={''}
            >
              {lang.t('account.claim')}
            </a>
          }
        </Dropdown.Button>
      </Badge>
    );
  };
  const onClaimClickHandle = (token: ITokenInfo) => async () => {
    if (!account) {
      return;
    }
    try {
      const gasEstimation = await Token.getToken(
        token.tokenAddress
      ).estimateClaimGas(account);
      setState({
        ...state,
        ...{
          claimConfirmationVisible: true,
          claimTokenAddress: token.tokenAddress,
          authMessage: null,
          gasEstimation,
        },
      });
      onSyncAccount();
    } catch (error) {
      notification.error({ message: error.message });
    }
  };
  const renderAuthMessageFormModal = () => {
    const token = getToken(TokenType.VITA)!;
    if (!account) {
      return null;
    }
    return (
      <AuthorizedMessageModal
        visible={state.authorizedMessageFormVisible}
        onOK={async (authMessage: IAuthorizedMessage) => {
          try {
            const gasEstimation = await Token.getToken(
              token.tokenAddress
            ).estimateClaimAsGas(authMessage, account);
            setState({
              ...state,
              authorizedMessageFormVisible: false,
              claimConfirmationVisible: true,
              claimTokenAddress: token.tokenAddress,
              authMessage,
              gasEstimation,
            });
          } catch (error) {
            notification.error({ message: error.message });
          }
        }}
        onCancel={() => {
          setState({ ...state, authorizedMessageFormVisible: false });
        }}
      />
    );
  };
  const getToken = (symbol: 'IOTX' | 'VITA') => {
    return Object.keys(state.tokenInfos)
      .map((addr) => state.tokenInfos[addr])
      .find((ti) => ti && ti?.symbol === symbol);
  };
  const onSyncAccount = () => {
    setState({ ...state, isSyncing: true, isLoading: true });
    pollAccount();
  };
  const getAccount = async (account: Account) => {
    if (!account) {
      return;
    }
    const addressRes = await getAntenna().iotx.getAccount({
      address: account.address,
    });
    if (addressRes) {
      setState({ ...state, accountMeta: addressRes.accountMeta });
    }
  };
  const getTokensInfo = async () => {
    if (!account) {
      return;
    }

    let tokenAddresses = xconf.getConf<Array<string>>(
      `${XConfKeys.TOKENS_ADDRS}_${state.accountCheckID}`,
      []
    );

    tokenAddresses = [...wallet.state.defaultNetworkTokens, ...tokenAddresses];
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
    setState({ ...state, tokenInfos: newTokenInfos });
    // dispatch(setTokens(newTokenInfos));
    wallet.state.tokens = newTokenInfos;
  };
  const claimableAmount = async (tokenAddress: string, address: string) => {
    return await Token.getToken(tokenAddress).claimableAmount(address);
  };
  const pollAccount = async () => {
    let pollAccountInterval = window.setTimeout(pollAccount, 10000);
    window.clearTimeout(pollAccountInterval);
    if (account) {
      await getAccount(account);
      await getTokensInfo();
      const tokens = Object.keys(state.tokenInfos);
      if (tokens.length > 0) {
        const tokenAddress = Token.getVitaToken(tokens);
        if (tokenAddress) {
          const ca = await claimableAmount(tokenAddress, account.address);
          const claimable = ca.isGreaterThan(0);
          setState({ ...state, claimable });
          setState({ ...state, claimableAmount: ca.toNumber() });
        }
      }
      setState({ ...state, isLoading: false, isSyncing: false });
    }
    pollAccountInterval = window.setTimeout(pollAccount, 10000);
  };
  const renderGenerateAuthorizedMessageFormModal = () => {
    const token = getToken(TokenType.VITA)!;
    return (
      <GeneralAuthorizedModal
        visible={state.generateAuthMessageFormVisible}
        token={token}
        onClose={() => {
          setState({
            ...state,
            generateAuthMessageFormVisible: false,
          });
        }}
      />
    );
  };
  const renderBidConfirmation = () => {
    const {
      bidConfirmationVisible: bidConfirmation,
      bidAmount,
      gasEstimation,
    } = state;
    if (!account || !gasEstimation) {
      return null;
    }
    const dataSource = {
      amount: `${bidAmount} IOTX`,
      sendTo: account.address,
      method: 'bid',
      limit: gasEstimation.gasLimit,
      price: gasEstimation.gasPrice,
    };

    return (
      <ConfirmContractModalComponent
        dataSource={dataSource}
        confirmContractOk={async (ok: boolean) => {
          setState({
            ...state,
            isBidding: true,
          });
          if (ok) {
            await placeBid(bidAmount);
          }
          setState({
            ...state,
            bidConfirmationVisible: false,
            isBidding: false,
          });
        }}
        showModal={bidConfirmation}
        confirmLoading={state.isBidding}
      />
    );
  };
  const placeBid = async (amount: string) => {
    const { bidContractAddress } = base;
    if (!account) {
      return;
    }

    try {
      const txHash = await Token.getBiddingToken(bidContractAddress).bid(
        account,
        amount
      );
      // @ts-ignore
      window.console.log(`Place bid ${amount} IOTX at action hash: ${txHash}`);
      history.push(`/wallet/smart-contract/interact/${txHash}`);
    } catch (e) {
      notification.error({
        message: `Failed to bid: ${e}`,
      });
    }
  };
  useEffect(() => {
    (async () => {
      const dataSource = Object.keys(state.tokenInfos)
        .map((addr) => state.tokenInfos[addr])
        .filter((tokenInfo) => tokenInfo && tokenInfo.symbol);
      if (state.accountMeta) {
        dataSource.unshift({
          symbol: 'IOTX',
          balanceString: new BigNumber(
            fromRau(state.accountMeta.balance, '')
          ).toString(10),
          tokenAddress: '',
          balance: new BigNumber(
            toPrecisionFloor(state.accountMeta.balance, {
              format: '0,0.[0000000000]',
            })
          ),
          decimals: new BigNumber(0),
          name: 'IOTX',
        });
      }
      const addressRes = await getAntenna().iotx.getAccount({
        address: wallet.state.account!.address,
      });
      if (addressRes) {
        setState({ ...state, accountMeta: addressRes.accountMeta });
      }
      let tokenAddresses = xconf.getConf<Array<string>>(
        `${XConfKeys.TOKENS_ADDRS}_${state.accountCheckID}`,
        []
      );
      const tokenInfos = await Promise.all(
        tokenAddresses.map((addr) =>
          Token.getToken(addr).getInfo(wallet.state.account!.address)
        )
      );
      const newTokenInfos: ITokenInfoDict = {};
      tokenInfos.forEach((info) => {
        if (info && info.symbol) {
          newTokenInfos[info.tokenAddress] = info;
        }
      });
      setState({ ...state, tokenInfos: newTokenInfos });
    })();
  });
  return (
    <div className="w-full" style={{ background: '#fff' }}>
      <Row className="justify-end py-2 px-8">
        <Button
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: colors.deltaUp,
          }}
          onClick={() =>
            setState({ ...state, showBalance: !state.showBalance })
          }
        >
          <span>
            <EyeOutlined />
            {state.showBalance
              ? lang.t('account.balance.hide')
              : lang.t('account.balance.show')}
          </span>
        </Button>
      </Row>
      <Row className="py-2 px-8 justify-between">
        <Row>
          IOTX
          <span>{state.showBalance ? state.IOTXBalance : '******'}</span>
        </Row>
        <Row>
          <a
            href="javascript:void 0;"
            onClick={() => shell.openExternal(VOTING_URL)}
          >
            Vote for delegate
          </a>
        </Row>
      </Row>
      <Row className="py-2 px-8 justify-between">
        <Row>
          VITA
          <span>{state.showBalance ? state.VITABalance : '******'}</span>
        </Row>
        <Row>
          <a
            href="javascript:void 0;"
            onClick={() => shell.openExternal(DISCORD_URL)}
          >
            Join Discord
          </a>
        </Row>
      </Row>
      <Row className="justify-end">
        <div style={{ paddingBottom: 42 }}>
          <Row
            align="middle"
            style={{
              position: 'absolute',
              margin: '0 -20px',
            }}
            className="flex justify-end w-full p-4"
          >
            <Button
              key="bid"
              onClick={() => {
                setState({ ...state, bidFormModalVisible: true });
              }}
              style={{ marginRight: 4 }}
            >
              {lang.t('account.bid')}
            </Button>
            {renderClaimButton()}
            {renderAuthMessageFormModal()}
            {renderGenerateAuthorizedMessageFormModal()}
            {renderBidFormModal()}
            {renderBidConfirmation()}
          </Row>
        </div>
      </Row>
      <Row className="py-2 px-8"></Row>
    </div>
  );
};
