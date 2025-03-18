import * as React from 'react';
import { useState, useEffect } from 'react';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';
import TodoModel from './TodoModel';
import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleAll, clearCompleted } from './TodoModel';

const TodoApp: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: any) => state.todos);
  const [newTodo, setNewTodo] = useState('');
  const [nowShowing, setNowShowing] = useState(ALL_TODOS);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const router = (window as any).Router;
    if (router) {
      router.init('/');
    }
  }, []);

  const handleNewTodoKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode !== 13) {
      return;
    }
    event.preventDefault();
    const val = newTodo.trim();
    if (val) {
      dispatch(addTodo(val));
      setNewTodo('');
    }
  };

  const toggleAll = (checked: boolean) => {
    dispatch(toggleAll(checked));
  };

  const clearCompleted = () => {
    dispatch(clearCompleted());
  };

  const shownTodos = todos.filter((todo: any) => {
    switch (nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const todoItems = shownTodos.map((todo: any) => {
    return (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggle={() => dispatch(toggle(todo.id))}
        onDestroy={() => dispatch(destroy(todo.id))}
        onEdit={() => setEditing(todo.id)}
        editing={editing === todo.id}
        onSave={(title: string) => dispatch(save(todo.id, title))}
        onCancel={() => setEditing(null)}
      />
    );
  });

  const activeTodoCount = todos.reduce((accum: number, todo: any) => {
    return todo.completed ? accum : accum + 1;
  }, 0);

  const completedCount = todos.length - activeTodoCount;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onKeyDown={handleNewTodoKeyDown}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewTodo(event.target.value)}
          autoFocus={true}
        />
      </header>
      {todos.length > 0 && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => toggleAll(event.target.checked)}
            checked={activeTodoCount === 0}
          />
          <label
            htmlFor="toggle-all"
          >
            Mark all as complete
          </label>
          <ul className="todo-list">
            {todoItems}
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

export default TodoApp;