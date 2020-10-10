/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
import isElectron from 'is-electron';
import { WebUSBTransportProxy } from '../models/web-usb-transport-proxy.model';
import { TransportNodeHidProxy } from './transport-proxy';

export async function getTransportProxy(): Promise<
  TransportNodeHidProxy | WebUSBTransportProxy
> {
  return isElectron()
    ? new TransportNodeHidProxy()
    : new WebUSBTransportProxy();
}
