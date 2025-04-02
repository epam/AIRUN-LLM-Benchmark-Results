```tsx
import React, { useState, FormEvent } from 'react';
import { useAppDispatch } from '../../store';
import { removeTodo, toggleTodo, updateTodo } from './todosSlice';
import { Todo } from '../../types/Todo';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  function handleToggle() {
    dispatch(toggleTodo(todo.id));
  }

  function handleDestroy() {
    dispatch(removeTodo(todo.id));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newTitle = editTitle.trim();
    if (!newTitle) {
      dispatch(removeTodo(todo.id));
    } else {
      dispatch(updateTodo({ id: todo.id, title: newTitle }));
    }
    setEditing(false);
  }

  function handleDoubleClick() {
    setEditing(true);
  }

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button className="destroy" onClick={handleDestroy}></button>
      </div>
      {editing && (
        <form onSubmit={handleSubmit}>
          <input
            className="edit"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSubmit}
          />
        </form>
      )}
    </li>
  );
}
```