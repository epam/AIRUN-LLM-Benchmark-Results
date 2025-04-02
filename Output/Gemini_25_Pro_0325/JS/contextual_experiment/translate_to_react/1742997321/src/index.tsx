import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';

// Target the existing .todoapp element from index.html
const todoAppRootElement = document.querySelector('.todoapp');

if (todoAppRootElement) {
    // Clear Angular-specific attributes and potentially content if needed
    // Example: todoAppRootElement.removeAttribute('ng-controller');
    // todoAppRootElement.innerHTML = ''; // Uncomment if React should fully replace content

    const root = ReactDOM.createRoot(todoAppRootElement);
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          {/* App component now renders the content *inside* the .todoapp section */}
          <App />
        </Provider>
      </React.StrictMode>
    );
} else {
    console.error('Failed to find the .todoapp element to mount React app.');
    // Fallback: Create a new root element if .todoapp is not found
    const fallbackRootElement = document.createElement('div');
    fallbackRootElement.id = 'root'; 
    document.body.appendChild(fallbackRootElement);
    const root = ReactDOM.createRoot(fallbackRootElement);
     root.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    );
}
