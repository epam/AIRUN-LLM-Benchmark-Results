import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, toggleAll } from './store/todosSlice';
import TodoItem from './components/TodoItem';
import Footer from './components/Footer';
import { RootState } from './store/store';
import { KeyCodes, TodoFilters } from './constants';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);
  const [newTodo, setNewTodo] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNewTodoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode !== KeyCodes.ENTER) return;
    const value = newTodo.trim();
    if (value) {
      dispatch(addTodo(value));
      setNewTodo('');
    }
  };

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(e.target.checked));
  };

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;

  let shownTodos = todos;
  switch (filter) {
    case TodoFilters.ACTIVE:
      shownTodos = todos.filter(todo => !todo.completed);
      break;
    case TodoFilters.COMPLETED:
      shownTodos = todos.filter(todo => todo.completed);
      break;
    default:
      break;
  }

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          onKeyDown={handleNewTodoKeyDown}
          autoFocus
          ref={inputRef}
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
          <ul className="todo-list">
            {shownTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </section>
      )}
      <Footer />
    </div>
  );
};

export default App;
