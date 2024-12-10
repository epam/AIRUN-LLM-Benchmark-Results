import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { store } from './store/store';
import TodoApp from './components/TodoApp';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Route path="/" component={TodoApp} />
      </Router>
    </Provider>
  );
};

export default App;