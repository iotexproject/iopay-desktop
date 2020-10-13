/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare const window: any;

export class TransportNodeHidProxy {
  public async getPublicKey(path: Array<number>): Promise<Buffer> {
    // TODO: Need implement method in rederer thread.
    return window.getPublicKey(path);
  }

  public async sign(path: Array<number>, message: Uint8Array): Promise<Buffer> {
    const signature = window.sign(path, message);
    return Buffer.from(signature, 'hex');
  }

  public async signMessage(
    path: Array<number>,
    message: Uint8Array
  ): Promise<Buffer> {
    const signature = window.signMessage(path, message);
    return Buffer.from(signature, 'hex');
  }
}
