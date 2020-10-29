import { ITokenInfo } from "./wallet.interface";

export interface IGenerateAuthorizedMessageFormProps {
  onClose(): void;
  visible?: boolean;
  token: ITokenInfo;
}

export interface IGenerateAuthorizedMessageFormState {
  confirming: boolean;
  authMessage: string;
  isGenerateActive: boolean;
}
