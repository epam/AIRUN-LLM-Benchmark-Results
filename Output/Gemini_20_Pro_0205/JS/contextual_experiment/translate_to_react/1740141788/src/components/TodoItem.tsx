import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Todo } from '../types/Todo';
import { toggleTodo, editTodo, removeTodo } from '../store/todoSlice';
import { useTodoFocus } from '../hooks/useTodoFocus';
import { useTodoEscape } from '../hooks/useTodoEscape';

interface Props {
  todo: Todo;
}

const TodoItem: React.FC<Props> = ({ todo }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useTodoFocus(inputRef, editing);
  useTodoEscape(() => {
    setTitle(todo.title);
    setEditing(false);
  });

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleEdit = () => {
    setEditing(true);
    setTitle(todo.title);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      dispatch(editTodo({ id: todo.id, title: trimmedTitle }));
      setEditing(false);
    } else {
      dispatch(removeTodo(todo.id));
    }
  };

  const handleRemove = () => {
    dispatch(removeTodo(todo.id));
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={handleRemove} />
      </div>
      {editing && (
        <form onSubmit={handleSave}>
          <input
            ref={inputRef}
            className="edit"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
          />
        </form>
      )}
    </li>
  );
};

export default TodoItem;