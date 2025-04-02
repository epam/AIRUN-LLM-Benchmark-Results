```typescript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store/todosSlice';
import { ENTER_KEY } from '../constants';

export const TodoHeader: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const dispatch = useDispatch();

  const handleNewTodoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = newTodo.trim();
    if (val) {
      dispatch(addTodo(val));
      setNewTodo('');
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyDown={handleNewTodoKeyDown}
        autoFocus={true}
      />
    </header>
  );
};
```