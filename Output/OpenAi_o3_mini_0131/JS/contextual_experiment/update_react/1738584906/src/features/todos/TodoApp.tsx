```tsx
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addTodo, toggleAllTodos, toggleTodo, removeTodo, updateTodo, clearCompletedTodos } from './todosSlice';
import { TodoItem } from './TodoItem';
import { TodoFooter } from './TodoFooter';

const TodoApp: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch();
  const [nowShowing, setNowShowing] = useState('all');
  const [editing, setEditing] = useState<string | null>(null);
  const [newText, setNewText] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash === 'active' || hash === 'completed') {
        setNowShowing(hash);
      } else {
        setNowShowing('all');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const shownTodos = todos.filter(todo => {
    switch (nowShowing) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodoCount = todos.reduce((acc, todo) => todo.completed ? acc : acc + 1, 0);
  const completedCount = todos.length - activeTodoCount;

  const handleNewTodoKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode !== 13) return;
    e.preventDefault();
    const val = newText.trim();
    if (val) {
      dispatch(addTodo({ title: val }));
      setNewText('');
    }
  };

  const toggleAll = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAllTodos({ completed: e.target.checked }));
  };

  const toggle = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const destroy = (id: string) => {
    dispatch(removeTodo(id));
  };

  const edit = (id: string) => {
    setEditing(id);
  };

  const save = (id: string, text: string) => {
    dispatch(updateTodo({ id, title: text }));
    setEditing(null);
  };

  const cancel = () => {
    setEditing(null);
  };

  const clearCompleted = () => {
    dispatch(clearCompletedTodos());
  };

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newText}
          onChange={e => setNewText(e.target.value)}
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
          <ul className="todo-list">
            {shownTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                editing={editing === todo.id}
                onToggle={() => toggle(todo.id)}
                onDestroy={() => destroy(todo.id)}
                onEdit={() => edit(todo.id)}
                onSave={(text: string) => save(todo.id, text)}
                onCancel={() => cancel()}
              />
            ))}
          </ul>
        </section>
      )}
      {(activeTodoCount > 0 || completedCount > 0) && (
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={nowShowing}
          onClearCompleted={clearCompleted}
        />
      )}
    </div>
  );
};

export { TodoApp };
```