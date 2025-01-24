```ts
import React, {
  useState,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
  FormEvent
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addTodo,
  toggleTodo,
  removeTodo,
  saveTodo,
  clearCompleted,
  toggleAllTodos
} from "../slices/todosSlice";
import { Footer } from "./Footer";
import { TodoItem } from "./TodoItem";
import { IAppState, ITodo } from "../types";
import {
  ALL_TODOS,
  ACTIVE_TODOS,
  COMPLETED_TODOS,
  ENTER_KEY
} from "../constants";

export function App() {
  const [nowShowing, setNowShowing] = useState<string>(ALL_TODOS);
  const [editing, setEditing] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState("");

  const todos = useSelector((state: { todos: ITodo[] }) => state.todos);
  const dispatch = useDispatch();

  useEffect(() => {
    function onHashChange() {
      const route = window.location.hash.replace("#/", "");
      if (route === ACTIVE_TODOS) {
        setNowShowing(ACTIVE_TODOS);
      } else if (route === COMPLETED_TODOS) {
        setNowShowing(COMPLETED_TODOS);
      } else {
        setNowShowing(ALL_TODOS);
      }
    }
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function handleNewTodoKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode !== ENTER_KEY) {
      return;
    }
    e.preventDefault();
    const val = newTodo.trim();
    if (val) {
      dispatch(addTodo(val));
      setNewTodo("");
    }
  }

  function handleToggleAll(e: ChangeEvent<HTMLInputElement>) {
    dispatch(toggleAllTodos(e.target.checked));
  }

  function handleClearCompleted() {
    dispatch(clearCompleted());
  }

  const shownTodos = todos.filter((todo) => {
    if (nowShowing === ACTIVE_TODOS) {
      return !todo.completed;
    } else if (nowShowing === COMPLETED_TODOS) {
      return todo.completed;
    }
    return true;
  });

  const todoItems = shownTodos.map((todo) => (
    <TodoItem
      key={todo.id}
      todo={todo}
      onToggle={() => dispatch(toggleTodo(todo.id))}
      onDestroy={() => dispatch(removeTodo(todo.id))}
      onEdit={() => setEditing(todo.id)}
      editing={editing === todo.id}
      onSave={(val: string) => {
        dispatch(saveTodo({ id: todo.id, title: val }));
        setEditing(null);
      }}
      onCancel={() => setEditing(null)}
    />
  ));

  const activeTodoCount = todos.reduce((acc, todo) => (!todo.completed ? acc + 1 : acc), 0);
  const completedCount = todos.length - activeTodoCount;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleNewTodoKeyDown}
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
            checked={activeTodoCount === 0}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">{todoItems}</ul>
        </section>
      )}
      {(activeTodoCount > 0 || completedCount > 0) && (
        <Footer
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={nowShowing}
          onClearCompleted={handleClearCompleted}
        />
      )}
    </div>
  );
}
```