```typescript
import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../store';
import { toggleAll, clearCompleted } from './todoSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../../constants';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
import { TodoFooter } from './TodoFooter';

export const TodoListPage: React.FC = () => {
  const dispatch = useDispatch();
  const { filter: routeFilter } = useParams<{ filter?: string }>();
  const todos = useSelector((state: RootState) => state.todos.todos);

  const nowShowing = routeFilter || ALL_TODOS;

  const shownTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (nowShowing) {
        case ACTIVE_TODOS:
          return !todo.completed;
        case COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, nowShowing]);

  const activeTodoCount = useMemo(() => {
    return todos.reduce((accum, todo) => (todo.completed ? accum : accum + 1), 0);
  }, [todos]);

  const completedCount = todos.length - activeTodoCount;

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(event.target.checked));
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <TodoInput />
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
          <TodoList todos={shownTodos} />
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
```