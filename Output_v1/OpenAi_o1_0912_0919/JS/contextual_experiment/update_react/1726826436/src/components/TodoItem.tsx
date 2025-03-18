import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { toggleTodo, destroyTodo, saveTodo } from '../store/todosSlice';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: ITodo;
  editing: boolean;
  onEdit: (id: string) => void;
  onCancel: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, editing, onEdit, onCancel }) => {
  const [editText, setEditText] = useState(todo.title);
  const dispatch = useDispatch();
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditText(todo.title);
  }, [todo.title]);

  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(
        editFieldRef.current.value.length,
        editFieldRef.current.value.length
      );
    }
  }, [editing]);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDestroy = () => {
    dispatch(destroyTodo(todo.id));
  };

  const handleEdit = () => {
    onEdit(todo.id);
    setEditText(todo.title);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      onCancel();
    } else if (e.keyCode === ENTER_KEY) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      dispatch(saveTodo({ id: todo.id, title: val }));
    } else {
      dispatch(destroyTodo(todo.id));
    }
    setEditText(val);
  };

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
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={handleDestroy} />
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
