import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TodoFooter } from './components/TodoFooter';
import { TodoItem } from './components/TodoItem';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';
import { RootState } from './store';
import { addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted, toggleAll } from './slices/todoSlice';

const App: React.FC = () => {
  const [nowShowing, setNowShowing] = useState(ALL_TODOS);
  const [editing, setEditing] = useState<string | null>(null);
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const newFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const nowShowing = window.location.hash.replace(/^#\/?/, '');
      setNowShowing(nowShowing || ALL_TODOS);
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNewTodoKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();
    const val = newFieldRef.current?.value.trim();
    if (val) {
      dispatch(addTodo(val));
      if (newFieldRef.current) newFieldRef.current.value = '';
    }
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
    <TodoItem
      key={todo.id}
      todo={todo}
      onToggle={() => dispatch(toggleTodo(todo.id))}
      onDestroy={() => dispatch(deleteTodo(todo.id))}
      onEdit={() => setEditing(todo.id)}
      editing={editing === todo.id}
      onSave={(title) => {
        dispatch(editTodo({ id: todo.id, title }));
        setEditing(null);
      }}
      onCancel={() => setEditing(null)}
    />
  ));

  const activeTodoCount = todos.reduce((accum, todo) => (todo.completed ? accum : accum + 1), 0);
  const completedCount = todos.length - activeTodoCount;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          ref={newFieldRef}
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
            onChange={(e) => dispatch(toggleAll(e.target.checked))}
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
          onClearCompleted={() => dispatch(clearCompleted())}
        />
      )}
    </div>
  );
};

export default App;