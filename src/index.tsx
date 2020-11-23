import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import { store } from './store/index';

const app = (
  <Provider store={store}>
      <Router>
        <App />
      </Router>
  </Provider>
);

ReactDOM.render(
  app,
  document.getElementById('root'),
);

serviceWorker.unregister();
