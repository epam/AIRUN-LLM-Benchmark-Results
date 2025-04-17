import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { toggleTodo, removeTodo, editTodo } from "./todosSlice";
import { ITodo } from "../../types";

interface TodoItemProps {
  todo: ITodo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const node = inputRef.current;
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }, [isEditing]);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDestroy = () => {
    dispatch(removeTodo(todo.id));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.title);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleSubmit = () => {
    const text = editText.trim();
    if (text) {
      dispatch(editTodo({ id: todo.id, text }));
    } else {
      dispatch(removeTodo(todo.id));
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setEditText(todo.title);
      setIsEditing(false);
    } else if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <li className={classNames({ completed: todo.completed, editing: isEditing })}>
      {!isEditing ? (
        <div className="view">
          <input className="toggle" type="checkbox" checked={todo.completed} onChange={handleToggle} />
          <label onDoubleClick={handleEdit}>{todo.title}</label>
          <button className="destroy" onClick={handleDestroy} />
        </div>
      ) : (
        <input
          ref={inputRef}
          className="edit"
          value={editText}
          onChange={handleChange}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};

export default TodoItem;
