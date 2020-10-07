import { createHashHistory } from 'history';
import React, { useEffect } from 'react';
import { Router } from 'react-router-dom';
import Routes from '../Routes';
import { useStore } from '../stores/index';
import './root.component.scss';

const history = createHashHistory();

export function Root() {
  const { base } = useStore();
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(base.NODE_ENV);
  });
  return (
    <div className="wrapper">
      <Router history={history}>
        <Routes />
      </Router>
    </div>
  );
}
