import * as React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useMeStore } from './store/me';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { NotFound } from './pages/notFound';

export const Router: React.FunctionComponent = () => {
  const { state } = useMeStore();
  return (
    <BrowserRouter>
      <Switch>
        {state.me ? (
          <>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/login">
              <Redirect to="/home" />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </>
        ) : (
          <>
            <Route path="/login">
              <Login />
            </Route>
            <Redirect to="/login" />
          </>
        )}
      </Switch>
      <ToastContainer />
    </BrowserRouter>
  );
};
