/* eslint-disable no-await-in-loop */
/* eslint-disable no-bitwise */
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { CLA, INS } from '../constants/transport';
import { ISignChunk, ITransport } from '../interfaces/transport.interface';
import { errorCodeToString } from '../utils/error-code-to-string';
import {
  IProcessErrorResponse,
  processErrorResponse,
} from '../utils/process-error-response';
import { serializePath } from '../utils/serialize-path';
import { signGetChunks } from '../utils/sign-get-chunks';

export class IoTeXLedgerApp {
  private readonly transport: TransportWebUSB;

  constructor(transport: TransportWebUSB, scrambleKey = 'CSM') {
    if (typeof transport === 'undefined') {
      throw new Error('Transport has not been defined');
    }

    this.transport = transport;
    transport.decorateAppAPIMethods(
      this,
      ['getVersion', 'publicKey', 'sign', 'appInfo', 'deviceInfo'],
      scrambleKey
    );
  }

  public async getVersion() {
    return this.transport.send(CLA, INS.GET_VERSION, 0, 0).then((response) => {
      const errorCodeData = response.slice(-2);
      const returnCode = errorCodeData[0] * 256 + errorCodeData[1];
      return {
        code: returnCode,
        message: errorCodeToString(returnCode),
        mode: response[0] !== 0,
        major: response[1],
        minor: response[2],
        patch: response[3],
        deviceLocked: response[4] === 1,
      };
    }, processErrorResponse);
  }

  public async appInfo() {
    return this.transport.send(0xb0, 0x01, 0, 0).then((response: Buffer) => {
      const errorCodeData = response.slice(-2);
      const returnCode = errorCodeData[0] * 256 + errorCodeData[1];

      const result = {} as { error_message: string; return_code: number };

      let appName = 'err';
      let appVersion = 'err';
      let flagLen = 0;
      let flagsValue = 0;

      if (response[0] !== 1) {
        result.error_message = 'response format ID not recognized';
        result.return_code = 0x9001;
      } else {
        const appNameLen = response[1];
        appName = response.slice(2, appNameLen + 2).toString('ascii');
        let idx = appNameLen + 2;
        const appVersionLen = response[idx];
        idx += 1;
        appVersion = response.slice(idx, idx + appVersionLen).toString('ascii');
        idx += appVersionLen;
        const appFlagsLen = response[idx];
        idx += 1;
        flagLen = appFlagsLen;
        flagsValue = response[idx];
      }

      return {
        code: returnCode,
        message: errorCodeToString(returnCode),
        appName,
        appVersion,
        flagLen,
        flagsValue,
        flag_recovery: (flagsValue & 1) !== 0,
        flag_signed_mcu_code: (flagsValue & 2) !== 0,
        flag_onboarded: (flagsValue & 4) !== 0,
        flag_pin_validated: (flagsValue & 128) !== 0,
      };
    }, processErrorResponse);
  }

  public async deviceInfo() {
    return this.transport
      .send(0xe0, 0x01, 0, 0, Buffer.from([]), [0x9000, 0x6e00])
      .then((response: Buffer) => {
        const errorCodeData = response.slice(-2);
        const returnCode = errorCodeData[0] * 256 + errorCodeData[1];

        if (returnCode === 0x6e00) {
          return {
            return_code: returnCode,
            error_message: 'This command is only available in the Dashboard',
          };
        }

        const targetId = response.slice(0, 4).toString('hex');

        let pos = 4;
        const secureElementVersionLen = response[pos];
        pos += 1;
        const seVersion = response
          .slice(pos, pos + secureElementVersionLen)
          .toString();
        pos += secureElementVersionLen;

        const flagsLen = response[pos];
        pos += 1;
        const flag = response.slice(pos, pos + flagsLen).toString('hex');
        pos += flagsLen;

        const mcuVersionLen = response[pos];
        pos += 1;
        // Patch issue in mcu version
        let tmp = response.slice(pos, pos + mcuVersionLen);
        if (tmp[mcuVersionLen - 1] === 0) {
          tmp = response.slice(pos, pos + mcuVersionLen - 1);
        }
        const mcuVersion = tmp.toString();

        return {
          code: returnCode,
          message: errorCodeToString(returnCode),
          targetId,
          seVersion,
          flag,
          mcuVersion,
        };
      }, processErrorResponse);
  }

  public async publicKey(path: Array<number>) {
    const serializedPath = serializePath(path);
    return this.transport
      .send(CLA, INS.PUBLIC_KEY_SECP256K1, 0, 0, serializedPath)
      .then((response: Buffer) => {
        const errorCodeData = response.slice(-2);
        const returnCode = errorCodeData[0] * 256 + errorCodeData[1];
        const pk = Buffer.from(response.slice(0, 65));
        return {
          publicKey: pk,
          code: returnCode,
          message: errorCodeToString(returnCode),
        } as ITransport;
      }, processErrorResponse);
  }

  public async signSendChunk(
    type: number,
    chunkIdx: number,
    chunkNum: number,
    chunk: Buffer | undefined
  ) {
    return this.transport
      .send(CLA, type, chunkIdx, chunkNum, chunk, [0x9000, 0x6a80, 0x6986])
      .then((response: Buffer) => {
        const errorCodeData = response.slice(-2);
        const returnCode = errorCodeData[0] * 256 + errorCodeData[1];

        let errorMessage = errorCodeToString(returnCode);

        if (returnCode === 0x6a80) {
          errorMessage = response
            .slice(0, response.length - 2)
            .toString('ascii');
        }

        let signature: unknown = null;
        if (response.length > 2) {
          signature = response.slice(0, response.length - 2);
        }

        return {
          signature,
          code: returnCode,
          message: errorMessage,
        } as ISignChunk;
      }, processErrorResponse);
  }

  public async sign(path: Array<number>, message: Uint8Array) {
    const chunks = signGetChunks(path, message);
    try {
      const response = (await this.signSendChunk(
        INS.SIGN_SECP256K1,
        1,
        chunks.length,
        chunks[0]
      )) as ISignChunk;
      let result = {
        code: response.code,
        message: response.message,
        signature: null,
      } as ISignChunk;
      for (let i = 1; i < chunks.length; i += 1) {
        result = (await this.signSendChunk(
          INS.SIGN_SECP256K1,
          i + 1,
          chunks.length,
          chunks[i]
        )) as ISignChunk;
        if (result.code !== 0x9000) {
          break;
        }
      }
      return {
        code: result.code,
        message: result.message,
        signature: result.signature,
      } as ISignChunk;
    } catch (err) {
      return {
        return_code: err.statusCode,
        error_message: errorCodeToString(err.statusCode),
      } as IProcessErrorResponse;
    }
  }

  public async signMessage(path: Array<number>, message: Uint8Array) {
    const chunks = signGetChunks(path, message);
    try {
      const response = (await this.signSendChunk(
        INS.SIGN_PERSONAL_MESSAGE,
        1,
        chunks.length,
        chunks[0]
      )) as ISignChunk;
      let result = {
        code: response.code,
        message: response.message,
        signature: null,
      } as ISignChunk;

      for (let i = 1; i < chunks.length; i += 1) {
        result = (await this.signSendChunk(
          INS.SIGN_PERSONAL_MESSAGE,
          i + 1,
          chunks.length,
          chunks[i]
        )) as ISignChunk;
        if (result.code !== 0x9000) {
          break;
        }
      }

      return {
        code: result.code,
        message: result.message,
        signature: result.signature,
      };
    } catch (err) {
      return {
        return_code: err.statusCode,
        error_message: errorCodeToString(err.statusCode),
      } as IProcessErrorResponse;
    }
  }
}
