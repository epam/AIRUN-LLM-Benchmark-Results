import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addTodo, clearCompletedTodos } from '../store/slices/todoSlice';
import TodoList from './TodoList';

const App: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch();

  const [newTodo, setNewTodo] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      dispatch(addTodo(newTodo.trim()));
      setNewTodo('');
    }
  };

  const handleClearCompleted = () => {
    dispatch(clearCompletedTodos());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - remainingCount;

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          ref={inputRef}
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </header>
      {todos.length > 0 && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={completedCount === todos.length}
            onChange={() => {}}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <TodoList />
        </section>
      )}
      {todos.length > 0 && (
        <footer className="footer">
          <span className="todo-count">
            <strong>{remainingCount}</strong>{' '}
            {remainingCount === 1 ? 'item' : 'items'} left
          </span>
          <ul className="filters">
            <li>
              <a href="#/"
                className={window.location.hash === '#/' ? 'selected' : ''}
              >
                All
              </a>
            </li>
            <li>
              <a
                href="#/active"
                className={window.location.hash === '#/active' ? 'selected' : ''}
              >
                Active
              </a>
            </li>
            <li>
              <a
                href="#/completed"
                className={window.location.hash === '#/completed' ? 'selected' : ''}
              >
                Completed
              </a>
            </li>
          </ul>
          {completedCount > 0 && (
            <button className="clear-completed" onClick={handleClearCompleted}>
              Clear completed
            </button>
          )}
        </footer>
      )}
    </section>
  );
};

export default App;
