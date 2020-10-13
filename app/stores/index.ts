import React from 'react';
import { BaseStore } from './base';
import { UnlockStore } from './unlock.store';
import { LangStore } from './lang';

export const StoresContext = React.createContext({
  base: new BaseStore(),
  wallet: new UnlockStore(),
  lang: new LangStore(),
});

export const useStore = () => React.useContext(StoresContext);
