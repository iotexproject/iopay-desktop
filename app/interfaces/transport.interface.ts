export interface ISignChunk {
  signature: Buffer | null;
  code: number;
  message: string;
}

export interface ITransport {
  publicKey: Buffer;
  code: number;
  message: string;
}
