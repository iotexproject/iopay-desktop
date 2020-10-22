import React from 'react';
import { BaseStore } from './base.store';
import { WalletStore } from './wallet.store';
import { LangStore } from './lang.store';

export const StoresContext = React.createContext({
  base: new BaseStore(),
  wallet: new WalletStore(),
  lang: new LangStore(),
});

export const useStore = () => React.useContext(StoresContext);
