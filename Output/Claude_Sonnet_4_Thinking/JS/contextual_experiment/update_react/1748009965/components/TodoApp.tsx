import React from 'react';
import TodoHeader from './TodoHeader';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';

function TodoApp() {
  return (
    <div>
      <TodoHeader />
      <TodoList />
      <TodoFooter />
    </div>
  );
}

export default TodoApp;