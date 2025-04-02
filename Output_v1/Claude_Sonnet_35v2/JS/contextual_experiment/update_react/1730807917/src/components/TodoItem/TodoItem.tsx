import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { toggleTodo, removeTodo, editTodo } from '../../store/todoSlice';
import { KEYS } from '../../constants/constants';
import { Todo } from '../../types/types';

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
      editFieldRef.current.setSelectionRange(
        editFieldRef.current.value.length,
        editFieldRef.current.value.length
      );
    }
  }, [editing]);

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      dispatch(editTodo({ id: todo.id, title: val }));
      setEditText(val);
      setEditing(false);
    } else {
      dispatch(removeTodo(todo.id));
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === KEYS.ESCAPE) {
      setEditText(todo.title);
      setEditing(false);
    } else if (event.keyCode === KEYS.ENTER) {
      handleSubmit();
    }
  };

  return (
    <li
      className={classNames({
        completed: todo.completed,
        editing: editing
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(toggleTodo(todo.id))}
        />
        <label onDoubleClick={() => setEditing(true)}>{todo.title}</label>
        <button
          className="destroy"
          onClick={() => dispatch(removeTodo(todo.id))}
        />
      </div>
      <input
        ref={editFieldRef}
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