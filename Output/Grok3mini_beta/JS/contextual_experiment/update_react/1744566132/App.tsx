```typescript
import * as React from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, toggleAll } from "./todoSlice";
import { RootState } from "./store";
import { TodoItem } from "./TodoItem";
import { TodoFooter } from "./TodoFooter";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from "./constants";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todo.todos);
  const nowShowing = useSelector((state: RootState) => state.todo.nowShowing);

  const newTodoRef = useRef<HTMLInputElement>(null);

  const handleNewTodoKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode !== ENTER_KEY) return;
    event.preventDefault();
    const val = (newTodoRef.current?.value || '').trim();
    if (val) {
      dispatch(addTodo(val));
      if (newTodoRef.current) newTodoRef.current.value = '';
    }
  };

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    dispatch(toggleAll(checked));
  };

  const shownTodos = todos.filter(todo => {
    switch (nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const todoItems = shownTodos.map(todo => (
    <TodoItem key={todo.id} todo={todo} />
  ));

  const activeTodoCount = todos.reduce((accum, todo) => (todo.completed ? accum : accum + 1), 0);
  const completedCount = todos.length - activeTodoCount;

  let main;
  if (todos.length > 0) {
    main = (
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
    );
  }

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          ref={newTodoRef}
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus
        />
      </header>
      {main}
      <TodoFooter />
    </div>
  );
};

export default App;```