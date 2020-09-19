import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import Routes from '../Routes';
import { Router } from 'react-router-dom';
import { createHashHistory } from 'history';
import { useStore } from '../stores/index';

const history = createHashHistory();

const Root = () => {
  const { base } = useStore();
  useEffect(() => {
    console.log(base);
  });
  return (
    <Router history={history}>
      <Routes />
    </Router>
  );
};

export default hot(Root);
