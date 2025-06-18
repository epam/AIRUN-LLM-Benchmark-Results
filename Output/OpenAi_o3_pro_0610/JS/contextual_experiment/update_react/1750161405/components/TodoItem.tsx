import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  toggle,
  destroy,
  startEditing,
  cancelEditing,
  save,
} from '../features/todos/todosSlice';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const editingId = useAppSelector((state) => state.todos.editingId);

  const [editText, setEditText] = useState(todo.title);
  const editRef = useRef<HTMLInputElement>(null);

  const isEditing = editingId === todo.id;

  useEffect(() => {
    if (isEditing && editRef.current) {
      const node = editRef.current;
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }, [isEditing]);

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      dispatch(save({ id: todo.id, title: val }));
    } else {
      dispatch(destroy(todo.id));
    }
    dispatch(cancelEditing());
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      dispatch(cancelEditing());
    } else if (e.keyCode === ENTER_KEY) {
      handleSubmit();
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setEditText(e.target.value);
  };

  const handleEdit = () => {
    dispatch(startEditing(todo.id));
    setEditText(todo.title);
  };

  return (
    <li className={classNames({ completed: todo.completed, editing: isEditing })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(toggle(todo.id))}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={() => dispatch(destroy(todo.id))} />
      </div>
      <input
        ref={editRef}
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
