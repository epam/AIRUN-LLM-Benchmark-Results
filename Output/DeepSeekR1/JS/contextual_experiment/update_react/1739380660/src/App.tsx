import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { addTodo, toggleAll, setFilter, selectFilteredTodos } from './features/todos/todosSlice';
import { TodoFilter } from './types';
import { RootState } from './store';

export const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newTodo, setNewTodo] = useState('');
  const todos = useSelector(selectFilteredTodos);
  const filter = useSelector((state: RootState) => state.todos.filter);

  useEffect(() => {
    const routes = {
      '/': 'all',
      '/active': 'active',
      '/completed': 'completed'
    };
    navigate(Object.keys(routes).find(key => routes[key as keyof typeof routes] === filter) || '/');
  }, [filter, navigate]);

  const handleNewTodoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const text = newTodo.trim();
    if (text) {
      dispatch(addTodo(text));
      setNewTodo('');
    }
  };

  const activeTodoCount = todos.filter(todo => !todo.completed).length;

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
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={activeTodoCount === 0}
            onChange={(e) => dispatch(toggleAll(e.target.checked))}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {todos.map(todo => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </section>
      )}

      <Footer />
    </div>
  );
};