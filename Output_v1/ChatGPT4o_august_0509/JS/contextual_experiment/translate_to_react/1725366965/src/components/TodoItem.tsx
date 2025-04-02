import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, editTodo, removeTodo } from '../store/todoSlice';
import { Todo } from '../types/todo';
import { useTodoFocus } from '../hooks/useTodoFocus';
import { useTodoEscape } from '../hooks/useTodoEscape';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const dispatch = useDispatch();
  const inputRef = useTodoFocus(isEditing);

  useTodoEscape(() => {
    setEditText(todo.title);
    setIsEditing(false);
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleSubmit = () => {
    if (editText.trim()) {
      dispatch(editTodo({ id: todo.id, title: editText.trim() }));
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
        <button className="destroy" onClick={() => dispatch(removeTodo(todo.id))} />
      </div>
      {isEditing && (
        <input
          ref={inputRef}
          className="edit"
          value={editText}
          onChange={handleChange}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
        />
      )}
    </li>
  );
};

export default TodoItem;