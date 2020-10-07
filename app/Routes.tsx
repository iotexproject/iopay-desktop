import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { App } from './components/App';
import { LayoutComponent } from './components/layout/layout.component';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path="/" component={LayoutComponent} />
      </Switch>
    </App>
  );
}
