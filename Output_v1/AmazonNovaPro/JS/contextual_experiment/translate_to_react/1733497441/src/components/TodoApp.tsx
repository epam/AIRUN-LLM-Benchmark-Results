import React from 'react';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import Footer from './Footer';

const TodoApp: React.FC = () => {
  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <TodoInput />
      </header>
      <section className="main">
        <TodoList />
      </section>
      <Footer />
    </section>
  );
};

export default TodoApp;