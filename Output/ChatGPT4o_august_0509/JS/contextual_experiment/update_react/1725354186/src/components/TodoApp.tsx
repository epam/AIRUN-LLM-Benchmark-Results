import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TodoItem } from './TodoItem';
import { TodoFooter } from './TodoFooter';
import { RootState } from '../store/store';
import { addTodo, toggleTodo, toggleAll, destroyTodo, saveTodo, clearCompleted } from '../store/todoSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from '../utils/constants';

const TodoApp: React.FC = () => {
  const [nowShowing, setNowShowing] = useState<string>(ALL_TODOS);
  const [editing, setEditing] = useState<string | null>(null);
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleHashChange = () => {
      const route = window.location.hash.replace(/^#\//, '');
      setNowShowing(route || ALL_TODOS);
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNewTodoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();
    const input = event.currentTarget;
    const val = input.value.trim();
    if (val) {
      dispatch(addTodo(val));
      input.value = '';
    }
  };

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(event.target.checked));
  };

  const handleToggle = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const handleDestroy = (id: string) => {
    dispatch(destroyTodo(id));
  };

  const handleEdit = (id: string) => {
    setEditing(id);
  };

  const handleSave = (id: string, text: string) => {
    dispatch(saveTodo({ id, title: text }));
    setEditing(null);
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
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
      editing={editing === todo.id}
      onToggle={() => handleToggle(todo.id)}
      onDestroy={() => handleDestroy(todo.id)}
      onEdit={() => handleEdit(todo.id)}
      onSave={(text) => handleSave(todo.id, text)}
      onCancel={handleCancel}
    />
  ));

  const activeTodoCount = todos.reduce((accum, todo) => (todo.completed ? accum : accum + 1), 0);
  const completedCount = todos.length - activeTodoCount;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
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
            onChange={handleToggleAll}
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
          onClearCompleted={handleClearCompleted}
        />
      )}
    </div>
  );
};

export { TodoApp };
