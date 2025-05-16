import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { AppDispatch } from '../store';
import { toggleTodo, destroyTodo, editTodo } from '../features/todos/todosSlice';
import { Todo } from '../features/todos/types';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

interface TodoItemProps {
  todo: Todo;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (id: string, title: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, editing, onEdit, onCancel, onSave }) => {
  const dispatch: AppDispatch = useDispatch();
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDelete = () => {
    dispatch(destroyTodo(todo.id));
  };

  const handleDoubleClick = () => {
    onEdit();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' || event.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      onCancel();
    } else if (event.key === 'Enter' || event.keyCode === ENTER_KEY) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      onSave(todo.id, val);
      setEditText(val);
    } else {
      handleDelete();
    }
  };

  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(
        editFieldRef.current.value.length,
        editFieldRef.current.value.length
      );
    }
  }, [editing]);

  useEffect(() => {
    setEditText(todo.title);
  }, [todo.title, editing]);


  return (
    <li
      className={classNames({
        completed: todo.completed,
        editing: editing,
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button className="destroy" onClick={handleDelete} />
      </div>
      {editing && (
        <input
          ref={editFieldRef}
          className="edit"
          value={editText}
          onBlur={handleSubmit}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};

export default TodoItem;