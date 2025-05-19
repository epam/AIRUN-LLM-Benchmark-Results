import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, removeTodo, updateTodo } from '../features/todos/todoSlice';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [editText, setEditText] = useState(todo.title);
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (editText.trim()) {
      dispatch(updateTodo({ id: todo.id, title: editText }));
    } else {
      dispatch(removeTodo(todo.id));
    }
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
    setEditText(todo.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditText(todo.title);
      setEditing(false);
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (editing) {
      const node = document.querySelector(`[data-id="${todo.id}"]`);
      node?.focus();
      node?.setSelectionRange(editText.length, editText.length);
    }
  }, [editing, editText]);

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
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
      <input
        data-id={todo.id}
        className="edit"
        value={editText}
        onBlur={handleSubmit}
        onChange={(e) => setEditText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </li>
  );
};

export default TodoItem;