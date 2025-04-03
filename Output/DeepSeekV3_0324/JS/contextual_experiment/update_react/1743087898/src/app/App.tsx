import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { addTodo, toggleAll, clearCompleted } from './features/todos/todosSlice';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, FilterType } from './constants';

export const App = () => {
  const [nowShowing, setNowShowing] = useState<FilterType>(ALL_TODOS);
  const [editing, setEditing] = useState<string | null>(null);
  const newTodoRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todos.todos);

  useEffect(() => {
    const handleRouteChange = () => {
      const route = window.location.hash.replace('#/', '');
      switch (route) {
        case 'active':
          setNowShowing(ACTIVE_TODOS);
          break;
        case 'completed':
          setNowShowing(COMPLETED_TODOS);
          break;
        default:
          setNowShowing(ALL_TODOS);
      }
    };

    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();

    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  const handleNewTodoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter' || !newTodoRef.current) return;
    e.preventDefault();

    const val = newTodoRef.current.value.trim();
    if (val) {
      dispatch(addTodo(val));
      newTodoRef.current.value = '';
    }
  };

  const shownTodos = todos.filter(todo => {
    switch (nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodoCount = todos.reduce((count, todo) => 
    todo.completed ? count : count + 1, 0);
  
  const completedCount = todos.length - activeTodoCount;

  return (
    <div className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          ref={newTodoRef}
          className="new-todo"
          placeholder="What needs to be done?"
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
              onChange={() => dispatch(toggleAll(activeTodoCount !== 0))}
              checked={activeTodoCount === 0}
            />
            <label htmlFor="toggle-all">
              Mark all as complete
            </label>
            <ul className="todo-list">
              {shownTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  editing={editing === todo.id}
                  onToggle={() => dispatch(toggleTodo(todo.id))}
                  onDestroy={() => dispatch(destroyTodo(todo.id))}
                  onEdit={() => setEditing(todo.id)}
                  onSave={(text) => {
                    dispatch(saveTodo({id: todo.id, text}));
                    setEditing(null);
                  }}
                  onCancel={() => setEditing(null)}
                />
              ))}
            </ul>
          </section>
          <Footer
            count={activeTodoCount}
            completedCount={completedCount}
            nowShowing={nowShowing}
            onClearCompleted={() => dispatch(clearCompleted())}
          />
        </>
      )}
    </div>
  );
};