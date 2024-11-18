import React from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

const TodoApp: React.FC = () => {
  return (
    <div>
      <h1>Todo App</h1>
      <TodoForm />
      <TodoList />
    </div>
  );
};

export default TodoApp;
