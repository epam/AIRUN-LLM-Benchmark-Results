import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Todo } from '../types';
import { removeTodo, toggleComplete, editTodo } from '../store/todosSlice';

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  setEditedTodoId: (id: string | null) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, isEditing, setEditedTodoId }) => {
  const dispatch = useDispatch();
  const [editText, setEditText] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.setSelectionRange(editText.length, editText.length);
    }
  }, [isEditing, editText.length]);

  const handleToggleComplete = () => {
    dispatch(toggleComplete(todo.id));
  };

  const handleRemoveTodo = () => {
    dispatch(removeTodo(todo.id));
  };

  const handleDoubleClick = () => {
    setEditedTodoId(todo.id);
    setEditText(todo.title);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleEditSubmit = () => {
    dispatch(editTodo({ id: todo.id, title: editText }));
    setEditedTodoId(null);
  };

  const handleEditBlur = () => {
    // Use a timeout to allow click events on buttons inside the form to register
    // before the blur event potentially cancels the edit.
    setTimeout(() => {
      if (isEditing) {
        handleEditSubmit();
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditText(todo.title); // Revert changes
      setEditedTodoId(null);
    } else if (e.key === 'Enter') {
      handleEditSubmit();
    }
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button className="destroy" onClick={handleRemoveTodo}></button>
      </div>
      {isEditing && (
        <input
          ref={editInputRef}
          className="edit"
          value={editText}
          onChange={handleEditChange}
          onBlur={handleEditBlur}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};

export default TodoItem;
