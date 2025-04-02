import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { RootState } from './app/store';
import { addTodo, toggleAll, clearCompleted } from './features/todos/todosSlice';
import { ENTER_KEY } from './app/constants';
import { useLocation } from 'react-router-dom';

export const App = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos);
  const location = useLocation();
  const [editing, setEditing] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getCurrentFilter = useCallback(() => {
    switch(location.pathname) {
      case '/active': return 'active';
      case '/completed': return 'completed';
      default: return 'all';
    }
  }, [location.pathname]);

  const currentFilter = getCurrentFilter();

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;

  const handleNewTodoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    
    const val = inputRef.current?.value.trim();
    if (val) {
      dispatch(addTodo({ title: val }));
      inputRef.current.value = '';
    }
  };

  const shownTodos = todos.filter(todo => {
    switch(currentFilter) {
      case 'active': return !todo.completed;
      case 'completed': return todo.completed;
      default: return true;
    }
  });

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          ref={inputRef}
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus
        />
      </header>
      
      {!!todos.length && (
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
              <TodoItem
                key={todo.id}
                todo={todo}
                editing={editing === todo.id}
                onEdit={() => setEditing(todo.id)}
                onCancel={() => setEditing(null)}
                onSave={(text) => {
                  dispatch({ type: 'todos/saveTodo', payload: { id: todo.id, text } });
                  setEditing(null);
                }}
              />
            ))}
          </ul>
        </section>
      )}

      {(activeTodoCount > 0 || completedCount > 0) && (
        <Footer
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={currentFilter}
          onClearCompleted={() => dispatch(clearCompleted())}
        />
      )}
    </div>
  );
};
