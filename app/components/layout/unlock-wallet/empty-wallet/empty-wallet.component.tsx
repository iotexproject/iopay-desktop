import { Card } from "antd";
import React from "react";
// @ts-ignore
import emptyImage from '../../../../../resources/images/unlock-wallet.png';
import './empty-wallet.component.scss';
import { useStore } from "../../../../stores";
export const EmptyWalletComponent = () => {
  const { lang } = useStore();
  return (
    <Card
      bodyStyle={{ padding: 0 }}
      style={{ borderRadius: 5, height: "90%" }}
      className="blur--image__warpper"
    >
      <img className="globe" alt="globe" src={emptyImage} />
      <div className="centered-text">
        <p>{lang.t("account.empty.unlock")}</p>
      </div>
    </Card>
  );
}
