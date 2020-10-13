export interface ITransportProxy {
  getPublicKey(path: Array<number>): Promise<Buffer>;
  sign(path: Array<number>, message: Uint8Array): Promise<Buffer>;
  signMessage(path: Array<number>, message: Uint8Array): Promise<Buffer>;
}
