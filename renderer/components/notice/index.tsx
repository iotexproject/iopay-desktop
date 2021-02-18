import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import { css } from '../../utils/stitches.config'

type Props = {
  closeNotice?: Function
}

export const HomeNotice = observer(({ closeNotice }: Props) => {
  const { lang } = useStore();
  return (
    <div className={styles.homeNotice}>
      <div className="title">{lang.t("notice")}!</div>
      <p className="tips">{lang.t("wellcome.tips")}</p>
      <button onClick={() => closeNotice()}>{lang.t("notice.button")}</button>
    </div>
  );
});

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
      maxWidth: "700px",
      marginBottom: "5rem",
      fontWeight: 400,
      color: '#333'
    },
    button: {
      width: "16rem",
      borderRadius: "4px",
      border: "none",
      outline: 'none',
      backgroundColor: "#00B4A0",
      fontSize: "1rem",
      color: "#fff",
      height: 40,
      lineHeight: '40px',
      "&:hover,&:focus": {
        backgroundColor: "#00B4A0 !important",
        color: "#fff !important"
      }
    }
  })
}
