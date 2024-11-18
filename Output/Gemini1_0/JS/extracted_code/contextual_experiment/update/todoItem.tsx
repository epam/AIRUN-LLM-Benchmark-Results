// todoItem.tsx
import React from "react";
import { Utils } from "./utils";

const TodoItem = (props) => {
  const todo = props.todo;

  return (
    <li className={classNames({ completed: todo.completed, editing: props.editing })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={props.onToggle}
        />
        <label onDoubleClick={props.onEdit}>{todo.title}</label>
        <button className="destroy" onClick={props.onDestroy} />
      </div>
      <input
        ref="editField"
        className="edit"
        value={todo.title}
        onBlur={props.onCancel}
        onKeyDown={props.onSave}
      />
    </li>
  );
};

export { TodoItem };