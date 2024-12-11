import React from 'react';
import { useAppSelector } from '../store/store';
import { selectTodos, selectFilter } from '../store/todoSlice';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const todos = useAppSelector(selectTodos);
  const filter = useAppSelector(selectFilter);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <ul className="todo-list">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} {...todo} />
      ))}
    </ul>
  );
};

export default TodoList;