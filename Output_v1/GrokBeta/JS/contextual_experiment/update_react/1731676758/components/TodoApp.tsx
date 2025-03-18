```typescript
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TodoHeader } from './TodoHeader';
import { TodoItem } from './TodoItem';
import { TodoFooter } from './TodoFooter';
import { addTodo, toggleAll, clearCompleted, setVisibilityFilter } from '../store/todosSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { RootState } from '../store';

export const TodoApp: React.FC = () => {
  const dispatch = useDispatch();
  const { todos, visibilityFilter } = useSelector((state: RootState) => ({
    todos: state.todos,
    visibilityFilter: state.visibilityFilter
  }));

  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      switch (hash) {
        case '#/':
          dispatch(setVisibilityFilter(ALL_TODOS));
          break;
        case '#/active':
          dispatch(setVisibilityFilter(ACTIVE_TODOS));
          break;
        case '#/completed':
          dispatch(setVisibilityFilter(COMPLETED_TODOS));
          break;
        default:
          dispatch(setVisibilityFilter(ALL_TODOS));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [dispatch]);

  const shownTodos = todos.filter(todo => {
    switch (visibilityFilter) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;

  return (
    <div>
      <TodoHeader />
      {todos.length > 0 && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={(e) => dispatch(toggleAll(e.target.checked))}
            checked={activeTodoCount === 0}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {shownTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </section>
      )}
      {(activeTodoCount || completedCount) && (
        <TodoFooter />
      )}
    </div>
  );
};
```