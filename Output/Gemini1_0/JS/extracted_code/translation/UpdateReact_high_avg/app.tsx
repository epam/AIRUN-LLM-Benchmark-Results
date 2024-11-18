import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid";
import {
  addTodo,
  clearCompleted,
  destroy,
  save,
  toggle,
  toggleAll,
} from "./todoSlice";
import { TodoFooter } from "./TodoFooter";
import { TodoItem } from "./TodoItem";

const App = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  const [nowShowing, setNowShowing] = useState("ALL_TODOS");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const router = {
      "/": () => setNowShowing("ALL_TODOS"),
      "/active": () => setNowShowing("ACTIVE_TODOS"),
      "/completed": () => setNowShowing("COMPLETED_TODOS"),
    };
    router["/"]();
  }, []);

  const handleNewTodoKeyDown = (event) => {
    if (event.key !== "Enter") return;
    const val = event.target.value.trim();
    if (val) {
      dispatch(addTodo({ id: nanoid(), title: val, completed: false }));
      event.target.value = "";
    }
  };

  const handleToggleAll = (event) => {
    dispatch(toggleAll(event.target.checked));
  };

  const handleToggle = (todo) => {
    dispatch(toggle(todo));
  };

  const handleDestroy = (todo) => {
    dispatch(destroy(todo));
  };

  const handleEdit = (todo) => {
    setEditing(todo.id);
  };

  const handleSave = (todo, text) => {
    dispatch(save({ ...todo, title: text }));
    setEditing(null);
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const shownTodos = todos.filter((todo) => {
    switch (nowShowing) {
      case "ACTIVE_TODOS":
        return !todo.completed;
      case "COMPLETED_TODOS":
        return todo.completed;
      default:
        return true;
    }
  });

  const todoItems = shownTodos.map((todo) => (
    <TodoItem
      key={todo.id}
      todo={todo}
      onToggle={() => handleToggle(todo)}
      onDestroy={() => handleDestroy(todo)}
      onEdit={() => handleEdit(todo)}
      editing={editing === todo.id}
      onSave={(text) => handleSave(todo, text)}
      onCancel={handleCancel}
    />
  ));

  const activeTodoCount = todos.reduce((acc, todo) => (todo.completed ? acc : acc + 1), 0);
  const completedCount = todos.length - activeTodoCount;

  let footer;
  let main;
  if (activeTodoCount || completedCount) {
    footer = (
      <TodoFooter
        count={activeTodoCount}
        completedCount={completedCount}
        nowShowing={nowShowing}
        onClearCompleted={handleClearCompleted}
      />
    );
  }

  if (todos.length) {
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
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus
        />
      </header>
      {main}
      {footer}
    </div>
  );
};

export default App;