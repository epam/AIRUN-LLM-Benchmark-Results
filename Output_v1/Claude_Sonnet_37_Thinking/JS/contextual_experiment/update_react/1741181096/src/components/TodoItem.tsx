import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, deleteTodo, updateTodoTitle } from '../store/todoSlice';
import { Todo } from '../types';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(editFieldRef.current.value.length, editFieldRef.current.value.length);
    }
  }, [editing]);

  const handleSubmit = () => {
    const value = editText.trim();
    if (value) {
      dispatch(updateTodoTitle({ id: todo.id, title: value }));
      setEditText(value);
      setEditing(false);
    } else {
      dispatch(deleteTodo(todo.id));
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditText(todo.title);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      setEditing(false);
    } else if (event.keyCode === ENTER_KEY) {
      handleSubmit();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(toggleTodo(todo.id))}
        />
        <label onDoubleClick={handleEdit}>
          {todo.title}
        </label>
        <button 
          className="destroy" 
          onClick={() => dispatch(deleteTodo(todo.id))} 
        />
      </div>
      <input
        ref={editFieldRef}
        className="edit"
        value={editText}
        onBlur={handleSubmit}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </li>
  );
};

export default TodoItem;