import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, editTodo, removeTodo } from '../store/todoSlice';
import { useTodoFocus } from '../hooks/useTodoFocus';
import { useTodoEscape } from '../hooks/useTodoEscape';

type TodoItemProps = {
  todo: {
    id: string;
    title: string;
    completed: boolean;
  };
};

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const dispatch = useDispatch();
  const editInputRef = useTodoFocus(isEditing);

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
  };

  const handleSubmit = () => {
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle) {
      dispatch(editTodo({ id: todo.id, title: trimmedTitle }));
    } else {
      dispatch(removeTodo(todo.id));
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleEscape = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  useTodoEscape(handleEscape);

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(toggleTodo(todo.id))}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={() => dispatch(removeTodo(todo.id))} />
      </div>
      {isEditing && (
        <input
          ref={editInputRef}
          className="edit"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};

export default TodoItem;