```typescript
import * as React from "react";
import { useState, useRef, useEffect, memo } from "react";
import classNames from "classnames";
import { ENTER_KEY, ESCAPE_KEY } from "./constants";
import { useDispatch } from "react-redux";
import { setEditing, saveTodo, destroyTodo, toggleTodo } from "./todoSlice";
import { ITodo } from "./todoSlice";

const TodoItem = memo(({ todo, editing }: { todo: ITodo; editing: boolean }) => {
  const [editText, setEditText] = useState(todo.title);
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
    }
  }, [editing]);

  const handleSubmit = (event: React.FormEvent) => {
    const val = editText.trim();
    if (val) {
      dispatch(saveTodo({ id: todo.id, title: val }));
    } else {
      dispatch(destroyTodo(todo.id));
    }
  };

  const handleEdit = () => {
    dispatch(setEditing(todo.id));
    setEditText(todo.title);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      dispatch(setEditing(null));
    } else if (event.keyCode === ENTER_KEY) {
      handleSubmit(event);
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
          onChange={handleToggle}
        />
        <label onDoubleClick={handleEdit}>
          {todo.title}
        </label>
        <button className="destroy" onClick={handleDestroy} />
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
});

export { TodoItem };```