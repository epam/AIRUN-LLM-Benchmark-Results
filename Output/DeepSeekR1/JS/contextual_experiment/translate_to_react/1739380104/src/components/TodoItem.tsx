import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveTodo, deleteTodo, endEditing, selectEditingId } from '../store/todoSlice';
import { useTodoFocus } from '../hooks/useTodoFocus';
import { useTodoEscape } from '../hooks/useTodoEscape';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const dispatch = useDispatch();
  const editingId = useSelector(selectEditingId);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const isEditing = editingId === todo.id;
  
  const inputRef = useTodoFocus(isEditing);
  useTodoEscape(() => {
    setEditedTitle(todo.title);
    dispatch(endEditing());
  });

  useEffect(() => {
    setEditedTitle(todo.title);
  }, [todo.title]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const title = editedTitle.trim();
    
    if (title) {
      dispatch(saveTodo({ ...todo, title }));
    } else {
      dispatch(deleteTodo(todo.id));
    }
    dispatch(endEditing());
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(saveTodo({ ...todo, completed: !todo.completed }))}
        />
        <label onDoubleClick={() => dispatch(endEditing())}>{todo.title}</label>
        <button className="destroy" onClick={() => dispatch(deleteTodo(todo.id))} />
      </div>
      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="edit"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={() => handleSubmit()}
          />
        </form>
      )}
    </li>
  );
};