```tsx
import React from 'react';
import { Todo } from '../models/TodoModel';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  return (
    <div>
      <input type='checkbox' checked={todo.completed} onChange={() => {}} />
      <span>{todo.title}</span>
      <button onClick={() => console.log('Delete todo:', todo.id)}>Delete</button>
    </div>
  );
};

export default TodoItem;
```