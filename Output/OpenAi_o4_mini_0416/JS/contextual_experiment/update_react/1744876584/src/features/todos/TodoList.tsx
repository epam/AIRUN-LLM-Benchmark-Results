import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../types";
import { addTodo, toggleAll } from "./todosSlice";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from "../../constants";
import TodoItem from "./TodoItem";

const TodoList: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.items);
  const filter = useSelector((state: RootState) => state.todos.filter);
  const [newTodo, setNewTodo] = useState("");

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewTodo(e.target.value);

  const handleNewKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const title = newTodo.trim();
    if (title) {
      dispatch(addTodo(title));
      setNewTodo("");
    }
  };

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(e.target.checked));
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;

  return (
    <>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleNewChange}
          onKeyDown={handleNewKeyDown}
          autoFocus
        />
      </header>
      {todos.length > 0 && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={handleToggleAll}
            checked={activeCount === 0}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default TodoList;
