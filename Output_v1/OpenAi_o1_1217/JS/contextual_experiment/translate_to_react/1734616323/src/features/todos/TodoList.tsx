```tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  selectFilteredTodos,
  selectAllCompleted,
  toggleAll
} from './todosSlice';
import { TodoItem } from './TodoItem';

export function TodoList() {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectFilteredTodos);
  const allCompleted = useAppSelector(selectAllCompleted);

  if (!todos.length) {
    return null;
  }

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={allCompleted}
        onChange={() => dispatch(toggleAll(!allCompleted))}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
}
```