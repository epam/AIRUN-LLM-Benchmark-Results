```ts
import React, {
  useState,
  useRef,
  useEffect,
  FormEvent,
  KeyboardEvent
} from "react";
import classNames from "classnames";
import { ENTER_KEY, ESCAPE_KEY } from "../constants";
import { ITodoItemProps } from "../types";

export function TodoItem({
  todo,
  onToggle,
  onDestroy,
  onEdit,
  editing,
  onSave,
  onCancel
}: ITodoItemProps) {
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const val = editText.trim();
    if (val) {
      onSave(val);
      setEditText(val);
    } else {
      onDestroy();
    }
  }

  function handleEdit() {
    onEdit();
    setEditText(todo.title);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      onCancel();
    } else if (e.keyCode === ENTER_KEY) {
      handleSubmit(e as any);
    }
  }

  return (
    <li
      className={classNames({
        completed: todo.completed,
        editing
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={onDestroy} />
      </div>
      {editing && (
        <input
          ref={editFieldRef}
          className="edit"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
}
```