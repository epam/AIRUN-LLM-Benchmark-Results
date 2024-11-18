import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, removeTodo, editTodo } from '../store/todoSlice';
import useTodoFocus from '../hooks/useTodoFocus';
import useTodoEscape from '../hooks/useTodoEscape';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  useTodoFocus(editInputRef, isEditing);
  useTodoEscape(() => setIsEditing(false));

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleBlur = () => {
    if (title.trim()) {
      dispatch(editTodo({ id: todo.id, title: title.trim() }));
    } else {
      dispatch(removeTodo(todo.id));
    }
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleBlur();
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
        <button className="destroy" onClick={() => dispatch(removeTodo(todo.id))} />
      </div>
      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            ref={editInputRef}
            className="edit"
            value={title}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </form>
      )}
    </li>
  );
};

export default TodoItem;
