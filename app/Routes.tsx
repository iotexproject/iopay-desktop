/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './pages/App';
import HomePage from './pages/HomePage';
import { routes } from './constants/routes';

// Lazily load routes and code split with webpack
const LazyCounterPage = React.lazy(
  () => import(/* webpackChunkName: "CounterPage" */ './pages/CounterPage')
);

const CounterPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyCounterPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.COUNTER.path} component={CounterPage} />
        <Route path={routes.HOME.path} component={HomePage} />
      </Switch>
    </App>
  );
}
