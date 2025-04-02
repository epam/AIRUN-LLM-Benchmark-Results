import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import store from './store';
import App from './App';
import 'todomvc-app-css/index.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Route path="/:filter?" component={App} />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
