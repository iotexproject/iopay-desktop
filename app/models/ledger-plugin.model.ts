/* eslint-disable @typescript-eslint/lines-between-class-members */
import { Expose } from 'class-transformer';
import { Envelop, SealedEnvelop } from 'iotex-antenna/lib/action/envelop';
import { SignerPlugin } from 'iotex-antenna/lib/action/method';
import { ITransportProxy } from '../interfaces/transport-proxy.interface';

export class LedgerPlugin implements SignerPlugin {
  private readonly path: Array<number>;
  private readonly publicKey: Buffer;
  @Expose()
  private readonly proxy: ITransportProxy;

  constructor(path: Array<number>, publicKey: Buffer, proxy: ITransportProxy) {
    this.path = path;
    this.publicKey = publicKey;
    this.proxy = proxy;
  }

  public async signOnly(envelop: Envelop): Promise<SealedEnvelop> {
    const signed = await this.proxy.sign(this.path, envelop.bytestream());
    return new SealedEnvelop(
      envelop,
      Buffer.from(this.publicKey),
      Buffer.from(signed)
    );
  }

  public async signMessage(data: Uint8Array): Promise<Buffer> {
    const result = await this.proxy.signMessage(this.path, data);
    return result;
  }
}
