import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Todo } from '../types';
import { toggleTodo, editTodo, removeTodo } from '../features/todos/todosSlice';
import { useTodoFocus } from '../hooks/useTodoFocus';
import { useTodoEscape } from '../hooks/useTodoEscape';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);
  const originalTitleRef = useRef(todo.title);

  useTodoFocus(editInputRef, editing);
  useTodoEscape(editInputRef, () => revertEditing());

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDoubleClick = () => {
    setEditing(true);
    setEditedTitle(todo.title);
    originalTitleRef.current = todo.title;
  };

  const handleRemove = () => {
    dispatch(removeTodo(todo.id));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doneEditing();
  };

  const doneEditing = () => {
    const trimmedTitle = editedTitle.trim();
    if (!trimmedTitle) {
      dispatch(removeTodo(todo.id));
    } else if (trimmedTitle !== todo.title) {
      dispatch(editTodo({ id: todo.id, title: trimmedTitle }));
    }
    setEditing(false);
  };

  const revertEditing = () => {
    setEditedTitle(originalTitleRef.current);
    setEditing(false);
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
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button className="destroy" onClick={handleRemove}></button>
      </div>
      {editing && (
        <form onSubmit={handleEditSubmit}>
          <input
            className="edit"
            value={editedTitle}
            onChange={handleEditChange}
            onBlur={doneEditing}
            ref={editInputRef}
          />
        </form>
      )}
    </li>
  );
};

export default TodoItem;
