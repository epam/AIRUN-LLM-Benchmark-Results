```typescript
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toggleComplete, editTodo, deleteTodo } from '../slices/todosSlice';

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    completed: boolean;
  };
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editing) {
      editFieldRef.current?.focus();
    }
  }, [editing]);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    } else if (event.key === 'Escape') {
      setEditing(false);
      setEditText(todo.title);
    }
  };

  const handleSubmit = () => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      dispatch(editTodo({ id: todo.id, title: trimmedText }));
      setEditing(false);
    } else {
      dispatch(deleteTodo(todo.id));
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleToggleComplete = () => {
    dispatch(toggleComplete(todo.id));
  };

  const handleDestroy = () => {
    dispatch(deleteTodo(todo.id));
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button className="destroy" onClick={handleDestroy}></button>
      </div>
      {editing && (
        <input
          ref={editFieldRef}
          className="edit"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};

export default TodoItem;

```