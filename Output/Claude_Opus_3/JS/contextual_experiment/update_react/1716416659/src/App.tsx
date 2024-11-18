import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addTodo,
  toggleAllTodos,
  clearCompletedTodos,
} from './store/todoSlice';
import { RootState } from './store/store';
import TodoItem from './components/TodoItem';
import TodoFooter from './components/TodoFooter';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './utils/constants';

const App: React.FC = () => {
  const [nowShowing, setNowShowing] = useState(ALL_TODOS);
  const newTodoField = useRef<HTMLInputElement>(null);
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash === ALL_TODOS || hash === ACTIVE_TODOS || hash === COMPLETED_TODOS) {
        setNowShowing(hash);
      } else {
        setNowShowing(ALL_TODOS);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleNewTodoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = newTodoField.current!.value.trim();

    if (val) {
      dispatch(addTodo(val));
      newTodoField.current!.value = '';
    }
  };

  const toggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    dispatch(toggleAllTodos(checked));
  };

  const clearCompleted = () => {
    dispatch(clearCompletedTodos());
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

  const todoItems = shownTodos.map((todo) => (
    <TodoItem key={todo.id} todo={todo} />
  ));

  const activeTodoCount = todos.reduce((accum, todo) => {
    return todo.completed ? accum : accum + 1;
  }, 0);

  const completedCount = todos.length - activeTodoCount;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          ref={newTodoField}
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
            onChange={toggleAll}
            checked={activeTodoCount === 0}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">{todoItems}</ul>
        </section>
      )}
      {(activeTodoCount || completedCount) > 0 && (
        <TodoFooter
          activeTodoCount={activeTodoCount}
          completedTodoCount={completedCount}
          nowShowing={nowShowing}
          onClearCompleted={clearCompleted}
          onFilterChange={setNowShowing}
        />
      )}
    </div>
  );
};

export default App;
