```ts
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../features/todos/todosSlice';

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, title: string) => void;
  removeTodo: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, toggleTodo, updateTodo, removeTodo }) => {
  const [editing, setEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    if (editing) {
      finishEditing();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const finishEditing = () => {
    setEditing(false);
    const trimmedTitle = currentTitle.trim();
    if (!trimmedTitle) {
      removeTodo(todo.id);
    } else if (trimmedTitle !== todo.title) {
      updateTodo(todo.id, trimmedTitle);
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    setCurrentTitle(todo.title);
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
      {!editing ? (
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
          <button className="destroy" onClick={() => removeTodo(todo.id)}></button>
        </div>
      ) : (
        <input
          className="edit"
          ref={inputRef}
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      )}
    </li>
  );
};

export default TodoItem;
```