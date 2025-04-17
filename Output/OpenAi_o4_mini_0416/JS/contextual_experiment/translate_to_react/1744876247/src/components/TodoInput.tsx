```tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../store';
import { addTodo } from '../store/todosSlice';

const TodoInput: React.FC = () => {
  const [title, setTitle] = useState('');
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    dispatch(addTodo(trimmed));
    setTitle('');
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          ref={inputRef}
        />
      </form>
    </header>
  );
};

export default TodoInput;
```