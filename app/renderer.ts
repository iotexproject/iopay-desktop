/* eslint-disable @typescript-eslint/dot-notation */
import { ipcRenderer } from 'electron';

const { timeout: promiseTimeout } = require('promise-timeout');

window['getPublicKey'] = async function getPublicKey(path) {
  await ipcRenderer.send('getPublicKey', path);

  const result = await promiseTimeout(
    new Promise((resolve) => {
      ipcRenderer.on('getPublicKey-response', (_event, query) => {
        resolve(query);
      });
    }),
    6000
  );
  if (result.code && result.code !== 0x9000) {
    throw new Error(result.message);
  }
  if (result.error_message) {
    throw new Error(result.error_message);
  }
  return result.publicKey;
};
