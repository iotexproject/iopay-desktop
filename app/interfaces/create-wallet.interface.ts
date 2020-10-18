import { AccountMeta } from "../models/account-meta";
import { IAuthorizedMessage } from "./authorized-message.interface";
import { Dict } from "./dict.type";
import { IGasEstimation } from "./gas-estimation.interface";

export interface ICreateWallet {
}

export interface ICreateWalletState {
  accountMeta: AccountMeta;
  tokenInfos: Dict;
  customTokensFormVisible: boolean;
  accountCheckID: string;
  isLoading: boolean;
  isClaimingVita: boolean;
  isSyncing: boolean;
  claimConfirmationVisible: boolean;
  claimTokenAddress: string;
  authorizedMessageFormVisible: boolean;
  generateAuthMessageFormVisible: boolean;
  authMessage: IAuthorizedMessage | null;
  bidConfirmationVisible: boolean;
  isBidding: boolean;
  bidFormModalVisible: boolean;
  bidAmount: string;
  gasEstimation: IGasEstimation | null;
  claimable: boolean;
  claimableAmount: number;
  showBalance: boolean;
}
