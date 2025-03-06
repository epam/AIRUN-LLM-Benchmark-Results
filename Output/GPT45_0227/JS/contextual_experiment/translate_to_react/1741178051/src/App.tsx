import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import TodoInput from './features/todos/TodoInput';
import TodoList from './features/todos/TodoList';
import TodoFooter from './features/todos/TodoFooter';

const App: React.FC = () => (
  <Router>
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <TodoInput />
      </header>
      <TodoList />
      <TodoFooter />
    </section>
  </Router>
);

export default App;