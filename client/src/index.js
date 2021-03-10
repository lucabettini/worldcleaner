import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from './redux/store';
import ErrorBoundary from './components/ErrorBoundary';

import './styles/reset.css';
import 'react-slideshow-image/dist/styles.css';
import 'materialize-css/dist/css/materialize.min.css';
import './styles/style.scss';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);
