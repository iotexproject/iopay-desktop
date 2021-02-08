import React from 'react';
import { useObserver } from 'mobx-react';
import { useStore } from '../../../stores';
import { Button } from 'antd';
import { css } from '../../../modules/stitches/index'
import wellcomeLogo from '../../../../resources/images/wellcome_logo.png';

export const WellcomeIntro = () => {
  const { lang } = useStore();

  return useObserver(() => {
    return (
      <div className={styles.wellcome}>
        <img src={wellcomeLogo} alt="" />
        <div className="title">{lang.t("wellcome.title")}</div>
        <p className="tips">{lang.t("wellcome.tips")}</p>
        <Button>next</Button>
      </div>
    );
  });
};

const styles = {
  wellcome: css({
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: "2",
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#292936",
    color: "#B4B8CB",
    img: {
      width: "34vw",
      marginTop: "4.625rem",
      marginBottom: "3rem"
    },
    ".title": {
      fontSize: "1.5rem",
      fontWeight: 500,
      marginBottom: "1.5rem"
    },
    ".tips": {
      maxWidth: "56rem",
      textAlign: "center",
      fontSize: "1.125rem",
      lineHeight: "2rem",
      marginBottom: "10rem",
      fontFamily: "Roboto"
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
