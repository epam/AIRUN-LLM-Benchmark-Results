import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store';
import { TodoListPage } from './features/todos/TodoListPage';

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <section className="todoapp">
          <Routes>
            <Route path="/:filter?" element={<TodoListPage />} />
          </Routes>
        </section>
      </Router>
    </Provider>
  );
};
