import React from 'react';
import { useSelector } from 'react-redux';
import { selectTodos } from './todoSlice';
import TodoItem from './TodoItem';

function TodoList() {
  const todos = useSelector(selectTodos);

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;