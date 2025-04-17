import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import TodoApp from './components/TodoApp';

const App: React.FC = () => (
  <Provider store={store}>
    <TodoApp />
  </Provider>
);

export default App;
