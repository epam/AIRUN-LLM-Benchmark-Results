import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, Provider } from 'react-redux';

import TodoHeader from './components/TodoHeader';
import TodoItem from './components/TodoItem';
import TodoFooter from './components/TodoFooter';
import { store, RootState } from './store/store';
import {
  addTodo,
  toggleAll,
  toggle,
  destroy,
  save,
  clearCompleted,
} from './store/todoSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';

const App: React.FC = () => {
  const [nowShowing, setNowShowing] = useState(ALL_TODOS);
  const [editing, setEditing] = useState<string | null>(null);

  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(2) || '';
      if (hash === 'active') setNowShowing(ACTIVE_TODOS);
      else if (hash === 'completed') setNowShowing(COMPLETED_TODOS);
      else setNowShowing(ALL_TODOS);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

  const activeTodoCount = todos.reduce(
    (accum, todo) => (todo.completed ? accum : accum + 1),
    0
  );
  const completedCount = todos.length - activeTodoCount;

  const handleAddTodo = (title: string) => {
    dispatch(addTodo(title));
  };

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    dispatch(toggleAll(checked));
  };

  const handleToggle = (id: string) => {
    dispatch(toggle(id));
  };

  const handleDestroy = (id: string) => {
    dispatch(destroy(id));
  };

  const handleEdit = (id: string) => {
    setEditing(id);
  };

  const handleSave = (id: string, text: string) => {
    dispatch(save({ id, text }));
    setEditing(null);
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <div>
      <TodoHeader onAddTodo={handleAddTodo} />
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
                onToggle={handleToggle}
                onDestroy={handleDestroy}
                onEdit={handleEdit}
                editing={editing === todo.id}
                onSave={handleSave}
                onCancel={handleCancel}
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
          onClearCompleted={handleClearCompleted}
        />
      )}
    </div>
  );
};

const WrappedApp: React.FC = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default WrappedApp;