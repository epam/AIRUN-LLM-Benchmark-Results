import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

const rootElement = document.getElementsByClassName('todoapp')[0];

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
