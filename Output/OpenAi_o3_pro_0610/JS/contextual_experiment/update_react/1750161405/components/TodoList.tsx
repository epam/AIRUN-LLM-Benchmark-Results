import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectFilteredTodos,
  selectActiveCount,
  toggleAll,
} from '../features/todos/todosSlice';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectFilteredTodos);
  const activeCount = useAppSelector(selectActiveCount);

  if (todos.length === 0) return null;

  const handleToggleAll: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(toggleAll(e.target.checked));
  };

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={handleToggleAll}
        checked={activeCount === 0}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
