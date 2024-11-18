import React, { useState } from 'react';
import { toggleTodo, editTodo, removeTodo } from '../redux/todosSlice';
import { useDispatch } from 'react-redux';

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    completed: boolean;
  };
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleToggle = () => dispatch(toggleTodo(todo.id));
  const handleRemove = () => dispatch(removeTodo(todo.id));
  const handleEdit = () => setEditing(true);
  const handleSave = () => {
    dispatch(editTodo({ id: todo.id, title: newTitle }));
    setEditing(false);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value);

  return (
    <li>
      <input type="checkbox" checked={todo.completed} onChange={handleToggle} />
      {editing ? (
        <input type="text" value={newTitle} onChange={handleInputChange} />
      ) : (
        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.title}</span>
      )}
      {editing ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}
      <button onClick={handleRemove}>Remove</button>
    </li>
  );
};

export default TodoItem;
