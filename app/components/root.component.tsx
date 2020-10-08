import { initClientI18n } from 'onefx/lib/iso-i18n';
import React from 'react';
import { useStore } from '../stores';
import { App } from './App';
import { LayoutComponent } from './layout/layout.component';
import './root.component.scss';

export function Root() {
  const { lang } = useStore();
  lang.init();
  initClientI18n(lang.translation);
  return (
    <div className="wrapper">
      <App>
        <LayoutComponent />
      </App>
    </div>
  );
}
