import React from 'react';
import { useAppSelector } from '../../store';
import { selectTodos } from './todosSlice';
import TodoItem from './TodoItem';
import { useLocation } from 'react-router-dom';

const TodoList: React.FC = () => {
  const todos = useAppSelector(selectTodos);
  const location = useLocation();

  const filteredTodos = todos.filter(todo => {
    if (location.pathname === '/active') return !todo.completed;
    if (location.pathname === '/completed') return todo.completed;
    return true;
  });

  return (
    <section className="main">
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;