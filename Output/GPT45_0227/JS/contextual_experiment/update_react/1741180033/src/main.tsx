import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store/store';

ReactDOM.createRoot(document.getElementsByClassName('todoapp')[0]).render(
  <Provider store={store}>
    <App />
  </Provider>
);