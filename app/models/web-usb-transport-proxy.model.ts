/* eslint-disable class-methods-use-this */
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { ITransportProxy } from '../interfaces/transport-proxy.interface';
import { IoTeXLedgerApp } from './iotex-ledger-app';
import { ITransport, ISignChunk } from '../interfaces/transport.interface';

export class WebUSBTransportProxy implements ITransportProxy {
  public async getPublicKey(path: Array<number>) {
    const transport = await TransportWebUSB.create();
    const app = new IoTeXLedgerApp(transport);
    const result = (await app.publicKey(path)) as ITransport;
    await transport.close();
    if (result.code !== 0x9000) {
      throw new Error(result.message);
    }
    return result.publicKey;
  }

  public async sign(path: Array<number>, message: Uint8Array) {
    const transport = await TransportWebUSB.create();
    const app = new IoTeXLedgerApp(transport);
    const result = (await app.sign(path, message)) as ISignChunk;
    await transport.close();
    if (result.code !== 0x9000) {
      throw new Error(result.message);
    }
    return result.signature as Buffer;
  }

  public async signMessage(path: Array<number>, message: Uint8Array) {
    const transport = await TransportWebUSB.create();
    const app = new IoTeXLedgerApp(transport);
    const result = (await app.signMessage(path, message)) as ISignChunk;
    await transport.close();
    if (result.code !== 0x9000) {
      throw new Error(result.message);
    }
    return result.signature as Buffer;
  }
}
