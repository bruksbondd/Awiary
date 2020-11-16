import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import { store } from './store/index';
import ErrorBoundry from './component/ErrorBoundry';

const app = (
  <Provider store={store}>
    <ErrorBoundry>
      <Router>
        <App />
      </Router>
    </ErrorBoundry>
  </Provider>
);

ReactDOM.render(
  app,
  document.getElementById('root'),
);

serviceWorker.unregister();
