import React from 'react';
import { useObserver } from 'mobx-react';
import { useStore } from '../../../stores';
import { Button } from 'antd';
import { css } from '../../../modules/stitches/index'

export const HomeImportWallet = () => {
  const { lang } = useStore();

  return useObserver(() => {
    return (
      <div className={styles.homeImportWallet}>

      </div>
    );
  });
};

const styles = {
  homeImportWallet: css({
    backgroundColor: "#fff",
    padding: "20px",
    width: "100%",
    height: "calc(100vh - 64px - 5rem)",
    boxSizing: "border-box",
  })
}
