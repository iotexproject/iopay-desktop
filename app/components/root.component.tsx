import React, { useEffect } from 'react';
import { useStore } from '../stores/index';
import { App } from './App';
import { LayoutComponent } from './layout/layout.component';
import './root.component.scss';

export function Root() {
  const { base } = useStore();
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(base.NODE_ENV);
  });
  return (
    <div className="wrapper">
      <App>
        <LayoutComponent />
      </App>
    </div>
  );
}
