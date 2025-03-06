import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TodoItem from './components/TodoItem';
import TodoFooter from './components/TodoFooter';
import { RootState } from './store/store';
import { addTodo, toggleTodo, toggleAll, destroyTodo, saveTodo, clearCompleted } from './store/todoSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';

const App: React.FC = () => {
  const [nowShowing, setNowShowing] = useState(ALL_TODOS);
  const [editing, setEditing] = useState<string | null>(null);
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch();

  const handleNewTodoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== ENTER_KEY) return;
    event.preventDefault();
    const val = event.currentTarget.value.trim();
    if (val) {
      dispatch(addTodo(val));
      event.currentTarget.value = '';
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

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
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
            onChange={e => dispatch(toggleAll(e.target.checked))}
            checked={activeTodoCount === 0}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {shownTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                editing={editing === todo.id}
                onToggle={() => dispatch(toggleTodo(todo.id))}
                onDestroy={() => dispatch(destroyTodo(todo.id))}
                onEdit={() => setEditing(todo.id)}
                onSave={title => {
                  dispatch(saveTodo({ id: todo.id, title }));
                  setEditing(null);
                }}
                onCancel={() => setEditing(null)}
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
          onClearCompleted={() => dispatch(clearCompleted())}
          setNowShowing={setNowShowing}
        />
      )}
    </div>
  );
};

export default App;