
import React from 'react';
import { css } from '../modules/stitches';
import { useStore } from '../stores';
import { App } from './App';
import { LayoutComponent } from './layout/layout.component';
import { cssUtils } from '../modules/stitches/css';


css.global({
  html: {
    margin: 0,
    padding: 0 ,
  }
})

export function Root() {
  const { lang } = useStore();
  lang.init();
  return (
    <div className={cssUtils.wrapper}>
      <App>
        <LayoutComponent />
      </App>
    </div>
  );
}
