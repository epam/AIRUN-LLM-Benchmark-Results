import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  toggleComplete, 
  removeTodo, 
  editTodo 
} from '../features/todos/todosSlice';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const dispatch = useDispatch();
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(todo.title);
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleSubmit = () => {
    if (isEditing) {
      const trimmedValue = editValue.trim();
      if (trimmedValue) {
        dispatch(editTodo({ id: todo.id, title: trimmedValue }));
      } else {
        dispatch(removeTodo(todo.id));
      }
      setIsEditing(false);
    }
  };

  const handleToggleComplete = () => {
    dispatch(toggleComplete(todo.id));
  };

  const handleRemoveTodo = () => {
    dispatch(removeTodo(todo.id));
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
          value={editValue} 
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      )}
    </li>
  );
};

export default TodoItem;
