import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState, AppDispatch } from './store';
import { toggleAllTodos } from './features/todos/todosSlice';
import { Todo } from './features/todos/types';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, FilterType } from './constants';

const App: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();

  const [nowShowing, setNowShowing] = useState<FilterType>(ALL_TODOS);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/active') {
      setNowShowing(ACTIVE_TODOS);
    } else if (currentPath === '/completed') {
      setNowShowing(COMPLETED_TODOS);
    } else {
      setNowShowing(ALL_TODOS);
    }
  }, [location.pathname]);

  const filteredTodos = todos.filter((todo: Todo) => {
    switch (nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodoCount = todos.reduce((count, todo) => (todo.completed ? count : count + 1), 0);
  const completedCount = todos.length - activeTodoCount;

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAllTodos(event.target.checked));
  };

  const mainContent = todos.length > 0 && (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={handleToggleAll}
        checked={activeTodoCount === 0 && todos.length > 0}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <TodoList
        filteredTodos={filteredTodos}
        editingId={editingId}
        setEditingId={setEditingId}
      />
    </section>
  );

  const footerContent = (activeTodoCount > 0 || completedCount > 0) && (
    <Footer nowShowing={nowShowing} />
  );

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <TodoInput />
      </header>
      {mainContent}
      {footerContent}
    </div>
  );
};

export default App;