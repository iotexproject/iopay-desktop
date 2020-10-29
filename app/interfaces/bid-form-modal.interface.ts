export interface IBidFormProps {
  onCancel(): void;
  onOK(amount: string): void;
  visible?: boolean;
}

export interface IBidFormState {
  confirming: boolean;
  authMessage: string;
  maxBidAmount: string;
  initialValue: string;
}
