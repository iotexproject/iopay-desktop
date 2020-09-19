import { TemplateStore } from './Template';
import React from 'react';
import { BaseStore } from './base';

export const StoresContext = React.createContext({
  base: new BaseStore(),
  template: new TemplateStore(),
});

export const useStore = () => React.useContext(StoresContext);
