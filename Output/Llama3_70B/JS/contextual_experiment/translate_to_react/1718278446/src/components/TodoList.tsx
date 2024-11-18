import React from 'react';
import TodoItem from './TodoItem';
import { useSelector } from 'react-redux';
import { selectTodos } from '../redux/todosSlice';

const TodoList: React.FC = () => {
  const todos = useSelector(selectTodos);

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;
