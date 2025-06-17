import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

const container =
    document.getElementById('root') ?? (() => {
        const div = document.createElement('div');
        div.id = 'root';
        document.body.appendChild(div);
        return div;
    })();

createRoot(container).render(
    <Provider store={store}>
        <App />
    </Provider>
);
