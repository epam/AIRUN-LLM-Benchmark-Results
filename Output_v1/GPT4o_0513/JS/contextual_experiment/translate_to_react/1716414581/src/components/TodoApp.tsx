import React from 'react';
import TodoHeader from './TodoHeader';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';

const TodoApp: React.FC = () => {
  return (
    <section className="todoapp">
      <TodoHeader />
      <section className="main">
        <TodoList />
      </section>
      <TodoFooter />
    </section>
  );
};

export default TodoApp;
