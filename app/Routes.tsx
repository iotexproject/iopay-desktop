import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { App } from './components/App';
import { CouterComponent } from './components/counter.component';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path="/" component={CouterComponent} />
      </Switch>
    </App>
  );
}
