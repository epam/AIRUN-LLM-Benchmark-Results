import React, { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { addTodo } from "./todosSlice";

const TodoForm: React.FC = () => {
  const [value, setValue] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    dispatch(addTodo(trimmed));
    setValue("");
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={value}
        onChange={e => setValue(e.target.value)}
        autoFocus
      />
    </form>
  );
};

export default TodoForm;
