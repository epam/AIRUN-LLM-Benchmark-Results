import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/todoSlice';
import App from './app';

const root = ReactDOM.createRoot(document.getElementsByClassName('todoapp')[0]);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
