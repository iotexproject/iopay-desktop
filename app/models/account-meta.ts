import { Type } from "class-transformer";

export class AccountMeta {
    @Type()
    public address!: string;
    @Type()
    public balance!: string;
    @Type()
    public nonce!: string | number;
    @Type()
    public pendingNonce!: string | number;
    @Type()
    public numActions!: string | number;
  }