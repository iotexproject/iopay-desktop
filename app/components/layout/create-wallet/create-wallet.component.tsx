import { BackwardFilled, DoubleLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useObserver } from 'mobx-react';
import React from 'react';
import { ICreateWallet } from '../../../interfaces/create-wallet.interface';
import { useStore } from '../../../stores';
import { Link } from 'react-router-dom';

export const CreateWalletComponent = (props: ICreateWallet) => {
  const { wallet } = useStore();
  return useObserver(() => {
    return (
      <>
        <Link to="/unlock" type="primary">
          <Button size="small" type="primary">
            Back
          </Button>
        </Link>
        {}
        CreateWalletComponent is working well!
      </>
    );
  });
};
