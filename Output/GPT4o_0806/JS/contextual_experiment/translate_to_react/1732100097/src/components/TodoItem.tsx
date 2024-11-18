import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, editTodo, removeTodo } from '../store/todoSlice';
import useTodoFocus from '../hooks/useTodoFocus';
import useTodoEscape from '../hooks/useTodoEscape';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  useTodoFocus(inputRef, isEditing);
  useTodoEscape(inputRef, () => {
    setIsEditing(false);
    setTitle(todo.title);
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (title.trim()) {
      dispatch(editTodo({ id: todo.id, title: title.trim() }));
    } else {
      dispatch(removeTodo(todo.id));
    }
    setIsEditing(false);
  };

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
        <button className="destroy" onClick={() => dispatch(removeTodo(todo.id))}></button>
      </div>
      {isEditing && (
        <input
          ref={inputRef}
          className="edit"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
      )}
    </li>
  );
};

export default TodoItem;