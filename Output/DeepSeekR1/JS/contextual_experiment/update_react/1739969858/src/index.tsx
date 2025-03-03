import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

const container = document.getElementsByClassName('todoapp')[0];
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);