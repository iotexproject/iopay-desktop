import { IAuthorizedMessage } from './authorized-message.interface';
export interface IAuthorizedMessageProps {
  onOK(authMessage: IAuthorizedMessage): void;
  onCancel(): void;
  visible?: boolean;
}
