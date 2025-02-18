```ts
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addTodo, toggleTodo, updateTodo, removeTodo, markAll, clearCompleted } from '../features/todos/todosSlice';

import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodoFilters, { FilterType } from './TodoFilters';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos);
  const [filter, setFilter] = useState<FilterType>('all');

  const handleAdd = (title: string) => {
    dispatch(addTodo(title));
  };

  const handleToggle = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const handleUpdate = (id: string, title: string) => {
    dispatch(updateTodo({ id, title }));
  };

  const handleRemove = (id: string) => {
    dispatch(removeTodo(id));
  };

  const handleMarkAll = (done: boolean) => {
    dispatch(markAll(done));
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  let filteredTodos = todos;
  if (filter === 'active') {
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (filter === 'completed') {
    filteredTodos = todos.filter(todo => todo.completed);
  }

  const remainingCount = todos.filter(todo => !todo.completed).length;
  const allChecked = todos.length > 0 && remainingCount === 0;

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <TodoForm onAdd={handleAdd} />
      </header>
      {todos.length > 0 && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={allChecked}
            onChange={(e) => handleMarkAll(e.target.checked)}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <TodoList
            todos={filteredTodos}
            toggleTodo={handleToggle}
            updateTodo={handleUpdate}
            removeTodo={handleRemove}
          />
        </section>
      )}
      {todos.length > 0 && (
        <footer className="footer">
          <span className="todo-count">
            <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item' : 'items'} left
          </span>
          <TodoFilters filter={filter} setFilter={setFilter} />
          {todos.some(todo => todo.completed) && (
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
```