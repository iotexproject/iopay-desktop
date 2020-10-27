import { Modal } from 'antd';
import React from 'react';
import { ConfirmContractModalProps } from '../../../../interfaces/contract-form-modal.interface';
import { useStore } from '../../../../stores';

export const ConfirmContractModalComponent = (
  props: ConfirmContractModalProps
) => {
  const {
    showModal,
    confirmContractOk,
    dataSource,
    showWhitelistBtn,
    onWhitelistBtnClick,
    children,
  } = props;
  const { lang } = useStore();

  return (
    <Modal
      title={<b>{lang.t('wallet.confirm.contract.title')}</b>}
      visible={showModal}
      width={616}
      bodyStyle={{ paddingBottom: 28, paddingTop: 0 }}
      okText={lang.t('wallet.confirm.contract.yes')}
      cancelText={lang.t('wallet.confirm.contract.cancel')}
      onOk={() => confirmContractOk(true)}
      onCancel={() => confirmContractOk(false)}
      confirmLoading={false}
      maskClosable={true}
    >
      <div>{JSON.stringify(dataSource)}</div>
      <div style={{ marginTop: 24, paddingLeft: 6 }}>
        <div className="flex justify-between items-center">
          <span>{lang.t('wallet.confirm.contract.p2')}</span>
          {!!showWhitelistBtn && (
            <a href="void:0" role="main" onClick={onWhitelistBtnClick}>
              {lang.t(
                props?.children
                  ? 'wallet.whitelist.cancel_addition'
                  : 'wallet.whitelist.add'
              )}
            </a>
          )}
        </div>
      </div>
      {children}
    </Modal>
  );
};
