import React from 'react';
import TodoForm from './features/todos/TodoForm';
import TodoList from './features/todos/TodoList';
import TodoFooter from './features/todos/TodoFooter';
import './App.css';

const App: React.FC = () => {
  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <TodoForm />
      </header>
      <TodoList />
      <TodoFooter />
    </section>
  );
};

export default App;
