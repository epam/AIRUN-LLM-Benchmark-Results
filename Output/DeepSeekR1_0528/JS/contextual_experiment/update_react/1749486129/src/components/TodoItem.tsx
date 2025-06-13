import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { saveTodo, toggleTodo, destroyTodo } from '../features/todo/todoSlice';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    completed: boolean;
  };
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  editing,
  onEdit,
  onCancel
}) => {
  const [editText, setEditText] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      );
    }
  }, [editing]);

  const handleSubmit = (event: React.FormEvent) => {
    const val = editText.trim();
    if (val) {
      dispatch(saveTodo({ id: todo.id, text: val }));
      onCancel();
    } else {
      dispatch(destroyTodo(todo.id));
    }
  };

  const handleEdit = () => {
    onEdit();
    setEditText(todo.title);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      onCancel();
    } else if (event.keyCode === ENTER_KEY) {
      handleSubmit(event);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  return (
    <li className={classNames({
      completed: todo.completed,
      editing: editing
    })}>
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
          onClick={() => dispatch(destroyTodo(todo.id))} 
        />
      </div>
      <input
        ref={inputRef}
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