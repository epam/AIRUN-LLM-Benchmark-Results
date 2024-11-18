import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { TodoModel } from './todoModel';
import { TodoFooter } from './footer';
import { TodoItem } from './todoItem';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, toggleTodo, destroyTodo, clearCompleted } from './todoSlice';

const TodoApp: React.FC = () => {
  const [nowShowing, setNowShowing] = useState(ALL_TODOS);
  const [editing, setEditing] = useState<string | null>(null);
  const todos = useSelector((state: any) => state.todos.todos);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.hash.replace('#/', '');
      setNowShowing(path || ALL_TODOS);
    };
    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  const handleNewTodoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) return;
    event.preventDefault();
    const input = event.currentTarget.value.trim();
    if (input) {
      dispatch(addTodo(input));
      event.currentTarget.value = '';
    }
  };

  const toggleAll = (event: React.FormEvent<HTMLInputElement>) => {
    const checked = event.currentTarget.checked;
    todos.forEach(todo => dispatch(toggleTodo(todo.id)));
  };

  const toggle = (todoToToggle: any) => {
    dispatch(toggleTodo(todoToToggle.id));
  };

  const destroy = (todo: any) => {
    dispatch(destroyTodo(todo.id));
  };

  const edit = (todo: any) => {
    setEditing(todo.id);
  };

  const save = (todoToSave: any, text: string) => {
    dispatch(destroyTodo(todoToSave.id));
    dispatch(addTodo(text));
    setEditing(null);
  };

  const cancel = () => {
    setEditing(null);
  };

  const clearCompleted = () => {
    dispatch(clearCompleted());
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
          autoFocus={true}
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
                onToggle={() => toggle(todo)}
                onDestroy={() => destroy(todo)}
                onEdit={() => edit(todo)}
                editing={editing === todo.id}
                onSave={text => save(todo, text)}
                onCancel={cancel}
              />
            ))}
          </ul>
        </section>
      )}
      {activeTodoCount || completedCount ? (
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={nowShowing}
          onClearCompleted={clearCompleted}
        />
      ) : null}
    </div>
  );
};

const model = new TodoModel('react-todos');

ReactDOM.render(<TodoApp />, document.getElementsByClassName('todoapp')[0]);