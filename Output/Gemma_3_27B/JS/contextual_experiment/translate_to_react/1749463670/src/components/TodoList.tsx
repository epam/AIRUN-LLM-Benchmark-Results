import React from 'react';
import { useSelector } from 'react-redux';
import TodoItem from './TodoItem';
import { RootState } from '../store/store';

function TodoList() {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const statusFilter = useSelector((state: RootState) => state.todos.statusFilter);

  const filteredTodos = statusFilter
    ? todos.filter((todo) =>
        statusFilter === 'completed' ? todo.completed : !todo.completed
      )
    : todos;

  return (
    <ul className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;