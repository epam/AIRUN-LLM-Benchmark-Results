import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { addTodo, clearCompleted, toggleAll } from './features/todos/todosSlice';
import TodoList from './components/TodoList';

function App() {
  const [input, setInput] = useState('');
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todos.todos);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    dispatch(addTodo(input.trim()));
    setInput('');
  };

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(e.target.checked));
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <div className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={handleAddTodo}>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
        </form>
      </header>
      <section className="main">
        {todos.length > 0 && (
          <>
            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              onChange={handleToggleAll}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <TodoList />
          </>
        )}
      </section>
      <footer className="footer">
        <span className="todo-count">
          <strong>{todos.filter(todo => !todo.completed).length}</strong> items left
        </span>
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      </footer>
    </div>
  );
}

export default App;