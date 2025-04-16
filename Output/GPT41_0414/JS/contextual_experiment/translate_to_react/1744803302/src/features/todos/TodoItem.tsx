import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  toggleTodo,
  removeTodo,
  editTodo,
  updateTodo,
  revertEditing,
  cancelEditing,
  Todo,
} from "./todosSlice";
import { useTodoFocus } from "../../utils/useTodoFocus";
import { useTodoEscape } from "../../utils/useTodoEscape";

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const { editedTodoId } = useAppSelector(state => state.todos);
  const [editValue, setEditValue] = useState(todo.title);
  const editing = editedTodoId === todo.id;
  const inputRef = useRef<HTMLInputElement>(null);
  useTodoFocus(inputRef, editing);
  useTodoEscape(inputRef, () => dispatch(revertEditing(todo.id)));

  const handleEdit = () => {
    setEditValue(todo.title);
    dispatch(editTodo(todo.id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateTodo({ id: todo.id, title: editValue }));
  };

  const handleBlur = () => {
    if (editing) {
      dispatch(updateTodo({ id: todo.id, title: editValue }));
    }
  };

  return (
    <li className={[
      todo.completed ? "completed" : "",
      editing ? "editing" : "",
    ].join(" ").trim()}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(toggleTodo(todo.id))}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={() => dispatch(removeTodo(todo.id))} />
      </div>
      {editing && (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="edit"
            value={editValue}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
          />
        </form>
      )}
    </li>
  );
};

export default TodoItem;
