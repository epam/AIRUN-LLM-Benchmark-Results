```tsx
import React, { FormEvent, useState } from 'react';
import { useAppDispatch } from '../../store';
import { addTodo } from './todosSlice';

export function TodoForm() {
  const [title, setTitle] = useState('');
  const dispatch = useAppDispatch();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newTitle = title.trim();
    if (!newTitle) {
      return;
    }
    dispatch(addTodo({ title: newTitle }));
    setTitle('');
  }

  return (
    <header className="header">
      <h1>todos</h1>
      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
}
```