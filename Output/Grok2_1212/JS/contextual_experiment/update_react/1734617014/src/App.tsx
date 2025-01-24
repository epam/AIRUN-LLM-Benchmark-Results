```typescript
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store/store';
import { addTodo, toggleAll, toggle, destroy, save, clearCompleted } from './store/todoSlice';
import TodoItem from './components/TodoItem';
import TodoFooter from './components/TodoFooter';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';
import { store } from './utils/utils';
import { ITodo, IAppState } from './types';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => state.todos);
  const [state, setState] = useState<IAppState>({ nowShowing: ALL_TODOS, editing: null });

  useEffect(() => {
    const todosFromStorage = store('react-todos') as ITodo[];
    if (todosFromStorage) {
      todosFromStorage.forEach(todo => dispatch(addTodo(todo.title)));
    }
  }, [dispatch]);

  useEffect(() => {
    const handleRouteChange = (path: string) => {
      switch (path) {
        case '/':
          setState({ ...state, nowShowing: ALL_TODOS });
          break;
        case '/active':
          setState({ ...state, nowShowing: ACTIVE_TODOS });
          break;
        case '/completed':
          setState({ ...state, nowShowing: COMPLETED_TODOS });
          break;
        default:
          setState({ ...state, nowShowing: ALL_TODOS });
      }
    };

    const handlePopState = () => {
      handleRouteChange(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [state]);

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
    dispatch(toggle(id));
  };

  const handleDestroy = (id: string) => {
    dispatch(destroy(id));
  };

  const handleEdit = (id: string) => {
    setState({ ...state, editing: id });
  };

  const handleSave = (id: string, text: string) => {
    dispatch(save({ id, text }));
    setState({ ...state, editing: null });
  };

  const handleCancel = () => {
    setState({ ...state, editing: null });
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const shownTodos = todos.filter((todo) => {
    switch (state.nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const todoItems = shownTodos.map((todo) => (
    <TodoItem
      key={todo.id}
      todo={todo}
      onToggle={() => handleToggle(todo.id)}
      onDestroy={() => handleDestroy(todo.id)}
      onEdit={() => handleEdit(todo.id)}
      editing={state.editing === todo.id}
      onSave={(text) => handleSave(todo.id, text)}
      onCancel={handleCancel}
    />
  ));

  const activeTodoCount = todos.reduce((accum, todo) => (!todo.completed ? accum + 1 : accum), 0);
  const completedCount = todos.length - activeTodoCount;

  const footer = (activeTodoCount || completedCount) ? (
    <TodoFooter
      count={activeTodoCount}
      completedCount={completedCount}
      nowShowing={state.nowShowing}
      onClearCompleted={handleClearCompleted}
    />
  ) : null;

  const main = todos.length ? (
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
        {todoItems}
      </ul>
    </section>
  ) : null;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus={true}
        />
      </header>
      {main}
      {footer}
    </div>
  );
};

export default App;
```