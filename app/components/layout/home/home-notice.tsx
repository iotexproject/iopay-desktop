import React from 'react';
import { useObserver } from 'mobx-react';
import { useStore } from '../../../stores';
import { Button } from 'antd';
import { css } from '../../../modules/stitches/index'

export const HomeNotice = () => {
  const { lang } = useStore();

  return useObserver(() => {
    return (
      <div className={styles.homeNotice}>
        <div className="title">{lang.t("notice")}!</div>
        <p className="tips">{lang.t("wellcome.tips")}</p>
        <Button>{lang.t("notice.button")}</Button>
      </div>
    );
  });
};

const styles = {
  homeNotice: css({
    backgroundColor: "#fff",
    padding: "20px",
    height: "calc(100vh - 64px - 5rem)",
    boxSizing: "border-box",
    ".title": {
      fontSize: "1.25rem",
      lineHeight: "1.5rem",
      fontWeight: "bold",
      marginBottom: "2.5rem",
    },
    ".tips": {
      fontSize: "1.125rem",
      lineHeight: "2rem",
      maxWidth: "52%",
      marginBottom: "5rem"
    },
    button: {
      width: "16rem",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#00B4A0",
      fontSize: "1rem",
      color: "#fff",
      "&:hover,&:focus": {
        backgroundColor: "#00B4A0 !important",
        color: "#fff !important"
      }
    }
  })
}
