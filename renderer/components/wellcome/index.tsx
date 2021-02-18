import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import { css } from '../../utils/stitches.config'

export const WellcomeIntro = observer(() => {
  const { lang } = useStore();
  return (
    <div className={styles.wellcome}>
      <img src="images/wellcome_logo.png" alt="" />
      <div className="title">{lang.t("wellcome.title")}</div>
      <p className="tips">{lang.t("wellcome.tips")}</p>
      <button className={styles.nextBtn}>{lang.t("wellcome.next")}</button>
    </div>
  );
});

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
  }),
  nextBtn: css({
    width: 240,
    height: 40,
    background: '#00B4A0',
    borderRadius: 4,
    textAlign: 'center',
    lineHeight: '40px',
    outline: 'none',
    border: 'none'
  })
}
