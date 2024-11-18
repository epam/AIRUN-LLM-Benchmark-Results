import React from 'react';
import { useAppSelector } from '../store/hooks';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const todos = useAppSelector(state => state.todos.todos);
  const location = window.location.pathname;

  const filteredTodos = todos.filter(todo => {
    if (location === '/active') return !todo.completed;
    if (location === '/completed') return todo.completed;
    return true;
  });

  return (
    <ul className="todo-list">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} id={todo.id} title={todo.title} completed={todo.completed} />
      ))}
    </ul>
  );
};

export default TodoList;
