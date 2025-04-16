import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { markAll, Todo } from "./todosSlice";
import TodoItem from "./TodoItem";

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, filter } = useAppSelector(state => state.todos);
  let filtered: Todo[] = items;
  if (filter === "active") {
    filtered = items.filter(t => !t.completed);
  } else if (filter === "completed") {
    filtered = items.filter(t => t.completed);
  }
  const allChecked = items.length > 0 && items.every(t => t.completed);

  if (items.length === 0) return null;

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={allChecked}
        onChange={e => dispatch(markAll(e.target.checked))}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {filtered.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
