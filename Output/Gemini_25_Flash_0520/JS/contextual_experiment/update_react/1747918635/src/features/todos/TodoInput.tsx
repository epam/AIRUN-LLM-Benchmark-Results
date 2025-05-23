```typescript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from './todoSlice';
import { ENTER_KEY } from '../../constants';

export const TodoInput: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const dispatch = useDispatch();

  const handleNewTodoKeyDown = (event: React.KeyboardEvent) => {
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  return (
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      value={newTodo}
      onKeyDown={handleNewTodoKeyDown}
      onChange={handleChange}
      autoFocus={true}
    />
  );
};
```