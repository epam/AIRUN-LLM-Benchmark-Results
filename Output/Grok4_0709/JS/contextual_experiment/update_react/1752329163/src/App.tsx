import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { toggleAll } from './store/todosSlice';
import TodoHeader from './components/TodoHeader';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import { Todo } from './types/todo';

const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';

const App: React.FC = () => {
  const location = useLocation();
  const [nowShowing, setNowShowing] = useState(ALL_TODOS);

  useEffect(() => {
    let path = location.pathname.substring(1) || ALL_TODOS;
    setNowShowing(path);
  }, [location]);

  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch<AppDispatch>();

  const activeTodoCount = todos.reduce((accum, todo) => todo.completed ? accum : accum + 1, 0);
  const completedCount = todos.length - activeTodoCount;

  const shownTodos = todos.filter((todo: Todo) => {
    switch (nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(e.target.checked));
  };

  return (
    <div>
      <TodoHeader />
      {todos.length > 0 && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={handleToggleAll}
            checked={activeTodoCount === 0}
          />
          <label htmlFor="toggle-all">
            Mark all as complete
          </label>
          <TodoList shownTodos={shownTodos} />
        </section>
      )}
      {(activeTodoCount > 0 || completedCount > 0) && (
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={nowShowing}
        />
      )}
    </div>
  );
};

export default App;