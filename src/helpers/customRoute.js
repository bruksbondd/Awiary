import Header from '../component/Header/Header';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

export function PrivateRoute({ component: Component, authenticated, ...rest }) {
  const history = createBrowserHistory();
  return (
    <Route
      history={history}
      {...rest}
      render={(props) =>
        authenticated === true ? (
          <>
            <Header />
            <Component {...props} />
          </>
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  );
}

export function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === false ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}
