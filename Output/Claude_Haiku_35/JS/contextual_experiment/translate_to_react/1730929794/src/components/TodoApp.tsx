import React from 'react';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';
import { useTodoStorage } from '../hooks/useTodoStorage';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const TodoApp: React.FC = () => {
  const { todos } = useSelector((state: RootState) => state.todos);
  useTodoStorage(todos);

  return (
    <div className="todoapp">
      <TodoInput />
      <TodoList />
      <TodoFooter />
    </div>
  );
};

export default TodoApp;