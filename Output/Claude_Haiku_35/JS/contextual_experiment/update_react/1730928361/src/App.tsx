import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/store';
import { TodoFilter } from './constants';
import { TodoItem } from './components/TodoItem';
import { TodoFooter } from './components/TodoFooter';
import { addTodo, toggleAllTodos } from './store/todoSlice';

const App: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.ALL);
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch();

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case TodoFilter.ACTIVE:
        return !todo.completed;
      case TodoFilter.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;

  const handleNewTodoKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const trimmedTodo = newTodo.trim();
      if (trimmedTodo) {
        dispatch(addTodo(trimmedTodo));
        setNewTodo('');
      }
    }
  }, [newTodo, dispatch]);

  const handleToggleAll = useCallback(() => {
    dispatch(toggleAllTodos(activeTodoCount > 0));
  }, [dispatch, activeTodoCount]);

  return (
    <div className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleNewTodoKeyDown}
          autoFocus
        />
      </header>

      {todos.length > 0 && (
        <>
          <section className="main">
            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              checked={activeTodoCount === 0}
              onChange={handleToggleAll}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
              {filteredTodos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>
          </section>

          <TodoFooter
            count={activeTodoCount}
            completedCount={completedCount}
            nowShowing={filter}
          />
        </>
      )}
    </div>
  );
};

export default App;