import React, { FC, useEffect } from 'react';
import { Switch } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { useSelector, useDispatch } from 'react-redux';

import { Home } from './pages/Home';
import { Login } from './pages/Sign/Login';
import { SignUp } from './pages/Sign/Signup';
import { Spinner } from './component/spinner/Spinner';
import { getAuthUserData } from './store/authReducer';
import { AppStateType } from './store';
import { PrivateRoute, PublicRoute } from './helpers/customRoute';
import { Day } from './pages/Day/Day';
import { Notes } from './pages/Notes/Notes';
import styles from './App.module.css';

const App: FC = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAuthUserData());
  }, [dispatch]);

  const loading = useSelector((state: AppStateType) => state.auth.loading);
  const isAuth = useSelector((state: AppStateType) => state.auth.isAuth);

  if (loading === true) {
    return <Spinner />;
  }

  return (
    <Container className={styles.container} maxWidth="xl">
      <Switch>
        <PrivateRoute exact path="/" authenticated={isAuth} component={Home} {...props} />
        <PrivateRoute path="/note" authenticated={isAuth} component={Notes} />
        <PrivateRoute
          path="/awareness"
          authenticated={isAuth}
          component={Notes}
        />
        <PrivateRoute
          path="/day/:dayId?"
          authenticated={isAuth}
          component={Day}
        />
        <PublicRoute path="/signup" authenticated={isAuth} component={SignUp} />
        <PublicRoute path="/login" authenticated={isAuth} component={Login} />
      </Switch>
    </Container>
  );
};

export default App;
