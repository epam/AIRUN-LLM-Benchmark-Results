import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TodoFooter } from './components/Footer';
import { TodoItem } from './components/TodoItem';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';
import { RootState } from './store/store';
import {
  addTodo,
  toggleAll,
  toggleTodo,
  destroyTodo,
  saveTodo,
  clearCompleted,
} from './store/todoSlice';

const App: React.FC = () => {
  const [nowShowing, setNowShowing] = useState(ALL_TODOS);
  const [editing, setEditing] = useState<string | null>(null);
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch();

  useEffect(() => {
    const router = {
      '/': () => setNowShowing(ALL_TODOS),
      '/active': () => setNowShowing(ACTIVE_TODOS),
      '/completed': () => setNowShowing(COMPLETED_TODOS),
    };
    const handleHashChange = () => {
      const route = window.location.hash.replace('#', '');
      if (router[route]) router[route]();
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNewTodoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) return;
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const val = input.value.trim();
    if (val) {
      dispatch(addTodo(val));
      input.value = '';
    }
  };

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(event.target.checked));
  };

  const handleToggle = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const handleDestroy = (id: string) => {
    dispatch(destroyTodo(id));
  };

  const handleEdit = (id: string) => {
    setEditing(id);
  };

  const handleSave = (id: string, title: string) => {
    dispatch(saveTodo({ id, title }));
    setEditing(null);
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
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
    <TodoItem
      key={todo.id}
      todo={todo}
      onToggle={() => handleToggle(todo.id)}
      onDestroy={() => handleDestroy(todo.id)}
      onEdit={() => handleEdit(todo.id)}
      editing={editing === todo.id}
      onSave={title => handleSave(todo.id, title)}
      onCancel={handleCancel}
    />
  ));

  const activeTodoCount = todos.reduce((accum, todo) => (todo.completed ? accum : accum + 1), 0);
  const completedCount = todos.length - activeTodoCount;

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

export default App;
