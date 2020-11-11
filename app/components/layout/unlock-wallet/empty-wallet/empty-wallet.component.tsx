import { Card } from "antd";
import React from "react";
// @ts-ignore
import emptyImage from '../../../../../resources/images/unlock-wallet.png';
import { css } from "../../../../modules/stitches";
import { useStore } from "../../../../stores";
export const EmptyWalletComponent = () => {
  const { lang } = useStore();
  return (
    <Card
      bodyStyle={{ padding: 0 }}
      style={{ borderRadius: 5, height: "90%" }}
      className="blur--image__warpper"
    >
      <img className={styles.globe} alt="globe" src={emptyImage} />
      <div className={styles.centeredText}>
        <p>{lang.t("account.empty.unlock")}</p>
      </div>
    </Card>
  );
}

const styles = {
    globe: css({
    width: "100% !important",
    maxHeight: "400px !important",
    filter: "blur(9px) !important",
  }),
  centeredText: css({
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center"
  })
}
