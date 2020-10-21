/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import { app, BrowserWindow, ipcMain } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import 'regenerator-runtime/runtime';
import MenuBuilder from './menu';
import { IoTeXLedgerApp } from './models/iotex-ledger-app';

const TransportNodeHid = require('@ledgerhq/hw-transport-node-hid').default;

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}


const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 755,
    minHeight: 549,
    webPreferences:
      (process.env.NODE_ENV === 'development' ||
        process.env.E2E_BUILD === 'true') &&
      process.env.ERB_SECURE !== 'true'
        ? { nodeIntegration: true }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js'),
            nodeIntegration: true,
          },
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('mainWindow is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
  // mainWindow.webContents.on('did-finish-load', () => {
  // });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.allowRendererProcessReuse = true;
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (process.env.E2E_BUILD === 'true') {
  // eslint-disable-next-line promise/catch-or-return
  app.whenReady().then(createWindow);
} else {
  app.on('ready', async () => {
    await createWindow();
    ipcMain.on('getPublicKey', async (event, _path) => {
      const transport = await TransportNodeHid.create();
      const ioTeXLedgerApp = new IoTeXLedgerApp(transport);
      const result = await ioTeXLedgerApp.publicKey(_path);
      await transport.close();
      event.reply('getPublicKey-response', result);
    });
  });
}

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
