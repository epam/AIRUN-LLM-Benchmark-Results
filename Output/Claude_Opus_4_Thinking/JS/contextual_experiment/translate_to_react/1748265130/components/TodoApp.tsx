import React from 'react';
import Header from './Header';
import TodoList from './TodoList';
import Footer from './Footer';

const TodoApp: React.FC = () => {
  return (
    <section className="todoapp">
      <Header />
      <TodoList />
      <Footer />
    </section>
  );
};

export default TodoApp;