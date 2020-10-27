export interface ContractFormormModel {
  sendTo: string;
  amount: string;
  gasPrice: string;
  gasLimit: string;
  dataHex: number;
  gasCostLimit: number;
  [key: string]: unknown;
}


export interface ConfirmContractModalProps {
  dataSource: ContractFormormModel;
  confirmContractOk: (confirmed: boolean) => void;
  showModal: boolean;
  showWhitelistBtn?: boolean;
  onWhitelistBtnClick?(): void;
  children?: unknown;
  [key: string]: unknown;
}
