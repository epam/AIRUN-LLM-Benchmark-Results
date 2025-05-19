import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app/store';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={App.store}>
      <BrowserRouter>
        <TodoApp />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);