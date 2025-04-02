import React from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

const App: React.FC = () => {
  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <TodoForm />
      </header>
      <TodoList />
    </section>
  );
};

export default App;