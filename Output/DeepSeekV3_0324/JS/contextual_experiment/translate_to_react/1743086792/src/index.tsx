import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { store } from './store/store';
import { TodoApp } from './components/TodoApp';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<TodoApp />} />
          <Route path="/active" element={<TodoApp />} />
          <Route path="/completed" element={<TodoApp />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);