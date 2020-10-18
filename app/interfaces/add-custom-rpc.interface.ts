export interface IAddCustomRPCProp {
  onOk: (values: Record<string, string>) => void;
  onCancel: () => void;
  visible: boolean;
}
