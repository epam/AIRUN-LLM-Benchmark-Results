import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import {
  addTodo,
  toggleAllTodos,
  toggleTodo,
  destroyTodo,
  editTodo,
  saveTodo,
  cancelEdit,
  clearCompletedTodos,
  setNowShowing,
  selectTodos,
  selectNowShowing,
  selectEditingId,
} from "./todosSlice";
import { TodoItem } from "./TodoItem";
import { TodoFooter } from "./TodoFooter";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from "./constants";

export const TodoApp: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector(selectTodos);
  const nowShowing = useSelector(selectNowShowing);
  const editingId = useSelector(selectEditingId);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const onHashChange = () => {
      switch (window.location.hash.replace("#", "")) {
        case "/active":
          dispatch(setNowShowing(ACTIVE_TODOS));
          break;
        case "/completed":
          dispatch(setNowShowing(COMPLETED_TODOS));
          break;
        default:
          dispatch(setNowShowing(ALL_TODOS));
      }
    };
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [dispatch]);

  const handleNewTodoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode !== ENTER_KEY) return;
    e.preventDefault();
    const val = inputValue.trim();
    if (val) {
      dispatch(addTodo(val));
      setInputValue("");
    }
  };

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAllTodos(e.target.checked));
  };

  const shownTodos = todos.filter((todo) => {
    switch (nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodoCount = todos.reduce((acc, todo) => (!todo.completed ? acc + 1 : acc), 0);
  const completedCount = todos.length - activeTodoCount;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          ref={inputRef}
          className="new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
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
          <ul className="todo-list">
            {shownTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                editing={editingId === todo.id}
                onToggle={() => dispatch(toggleTodo(todo.id))}
                onDestroy={() => dispatch(destroyTodo(todo.id))}
                onEdit={() => dispatch(editTodo(todo.id))}
                onSave={(text) => dispatch(saveTodo({ id: todo.id, title: text }))}
                onCancel={() => dispatch(cancelEdit())}
              />
            ))}
          </ul>
        </section>
      )}
      {(activeTodoCount > 0 || completedCount > 0) && (
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={nowShowing}
          onClearCompleted={() => dispatch(clearCompletedTodos())}
        />
      )}
    </div>
  );
};
