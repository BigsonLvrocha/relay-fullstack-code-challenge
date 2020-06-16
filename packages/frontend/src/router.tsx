import * as React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useMeStore } from './store/me';
import { App } from './pages/app';
import { Login } from './pages/login';
import { NotFound } from './pages/notFound';

export const Router: React.FunctionComponent = () => {
  const { state } = useMeStore();
  return (
    <BrowserRouter>
      {state.me ? (
        <Switch>
          <Route path="/app">
            <App />
          </Route>
          <Route path="/login">
            <Redirect to="/app/deliveries" />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      ) : (
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Redirect to="/login" />
        </Switch>
      )}

      <ToastContainer />
    </BrowserRouter>
  );
};
