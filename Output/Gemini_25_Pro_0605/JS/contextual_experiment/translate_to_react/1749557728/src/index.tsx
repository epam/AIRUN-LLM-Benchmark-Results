import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

const root = ReactDOM.createRoot(
  document.getElementsByClassName('todoapp')[0] as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
