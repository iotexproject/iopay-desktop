import { Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import isBrowser from "is-browser";
import React, { useEffect, useState } from "react";
import { IRPCProvider, CustomRPCProvider } from "../../../interfaces/rpc-provider.interface";
import { Token } from "../../../models/token.model";
import { useStore } from "../../../stores";
import { getAntenna } from "../../../utils/get-antenna";
import { AddCustomRpcFormModal } from "./add-custom-rpc-form-modal.component";
import { plainToClass } from "class-transformer";

export const formItemLayout = {

  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  },
  colon: false
};
export const setProviderNetwork = (network: IRPCProvider) => {
  if (isBrowser) {
    getAntenna().iotx.setProvider(network.coreApi);
    // setApolloClientEndpoint(`${network.url}api-gateway/`);
  }
};


export const ChainNetworkSwitchComponent = () => {
  const { Option } = Select;
  const [form] = useForm();
  const [visible, setVisible] = useState(false);
  const [supportTokens, setSupportTokens] = useState<string[]>([]);
  const { wallet, lang, base: { multiChain, defaultERC20Tokens } } = useStore();
  const { current, chains } = multiChain;

  const availableNetworks = [
    ...chains,
    ...wallet.state.customRPCs,
    {
      name: "custom",
      url: "",
      coreApi: ""
    }
  ] as IRPCProvider[];

  const onSelect = (value: string) => {
    console.log(value);
    if (value === "custom") {
      setVisible(true);
    } else {
      setProviderNetwork(availableNetworks?.find(network => network?.name === value)!);
      wallet.setNetWork(availableNetworks[value], supportTokens);
    }
    console.log(supportTokens);
  };
  const networkName = (name: string): string => {
    const locName = lang.t(`multiChain.chains.${name}`);
    return locName === `multiChain.chains.${name}` ? name : locName;
  };
  const onCreateCustomRPC = (value: Record<string, string>) => {
    console.log(value);
    setVisible(false);
    if (Object.values(value).every(v => !v)) {
      return;
    }
    const rpc = plainToClass(CustomRPCProvider, value);
    wallet.addCustomRpc(rpc);
  };

  useEffect(() => {
    const network = chains.find(chain => chain.name === current);
    if (network) {
      getAntenna().iotx.setProvider(network.coreApi);
    }
    const getDefaultNetworkTokens = async (defaultTokens: string[]) => {
      const tks = await Promise.all(
        defaultTokens.map(token => Token.getToken(token).checkValid())
      );
      setSupportTokens(defaultTokens.filter((_, i) => tks[i]));
      return defaultTokens.filter((_, i) => tks[i]);
    };
    getDefaultNetworkTokens(defaultERC20Tokens);
  }, [defaultERC20Tokens, chains]);
  return (
    <>
      <Select
        value={`test`}
        className="chain-network-switch"
        style={{ width: "100%" }}
        onSelect={onSelect}
      >
        {availableNetworks.map(rpc => (
          <Option value={rpc.name} key={rpc.name}>
            {networkName(networkName(rpc.name))}
          </Option>
        ))}
      </Select>
      <AddCustomRpcFormModal visible={visible} onOk={onCreateCustomRPC} onCancel={() => setVisible(false)} />
    </>
  );
};
