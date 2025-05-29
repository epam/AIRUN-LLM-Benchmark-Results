import React, { useState, useEffect, useRef, memo } from 'react';
import { useDispatch } from 'react-redux';
import { Todo } from '../types';
import { toggleTodo, destroyTodo, editTodo, saveTodo, cancelEdit } from '../todoSlice';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

interface TodoItemProps {
  todo: Todo;
  editing: boolean;
}

const TodoItem = memo(({ todo, editing }: TodoItemProps) => {
  const dispatch = useDispatch();
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editFieldRef.current) {
      const node = editFieldRef.current;
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }, [editing]);

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      dispatch(saveTodo({ id: todo.id, title: val }));
      setEditText(val);
    } else {
      dispatch(destroyTodo(todo.id));
    }
  };

  const handleEdit = () => {
    dispatch(editTodo(todo.id));
    setEditText(todo.title);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      dispatch(cancelEdit());
    } else if (event.keyCode === ENTER_KEY) {
      handleSubmit();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDestroy = () => {
    dispatch(destroyTodo(todo.id));
  };

  const itemClasses = [
    todo.completed ? 'completed' : '',
    editing ? 'editing' : ''
  ].filter(Boolean).join(' ');

  return (
    <li className={itemClasses}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleEdit}>
          {todo.title}
        </label>
        <button className="destroy" onClick={handleDestroy} />
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
});

export default TodoItem;