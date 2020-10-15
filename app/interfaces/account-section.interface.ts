import { Account } from "iotex-antenna/lib/account/account";
import { AccountMeta } from "iotex-antenna/protogen/proto/types/blockchain_pb";
import { IAuthorizedMessage } from "./authorized-message.interface";
import { IGasEstimation } from "./gas-estimation.interface";
import { IRPCProvider, ITokenInfoDict } from "./wallet.interface";

export interface IAccountSectionState {
  accountMeta: AccountMeta | undefined;
  tokenInfos: ITokenInfoDict;
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


export interface IAccountSectionProps {
  account?: Account;
  createNew?: boolean;
  network?: IRPCProvider;
  defaultNetworkTokens: Array<string>;
  bidContractAddress: string;
  address?: string;
}
