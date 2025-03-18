import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  clearCompleted,
  toggleAll
} from '../store/todoSlice';
import TodoItem from './TodoItem';
import TodoFooter from './Footer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from '../constants/constants';

const App: React.FC = () => {
  const [nowShowing, setNowShowing] = useState(ALL_TODOS);
  const [editing, setEditing] = useState<string | null>(null);
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch();

  const handleNewTodoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const input = event.target as HTMLInputElement;
    const val = input.value.trim();

    if (val) {
      dispatch(addTodo(val));
      input.value = '';
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

  const todoItems = shownTodos.map(todo => (
    <TodoItem
      key={todo.id}
      todo={todo}
      onToggle={() => dispatch(toggleTodo(todo.id))}
      onDestroy={() => dispatch(deleteTodo(todo.id))}
      onEdit={() => setEditing(todo.id)}
      editing={editing === todo.id}
      onSave={(text) => {
        dispatch(editTodo({ id: todo.id, title: text }));
        setEditing(null);
      }}
      onCancel={() => setEditing(null)}
    />
  ));

  const activeTodoCount = todos.reduce((accum, todo) => todo.completed ? accum : accum + 1, 0);
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
            onChange={(e) => dispatch(toggleAll(e.currentTarget.checked))}
            checked={activeTodoCount === 0}
          />
          <label htmlFor="toggle-all">
            Mark all as complete
          </label>
          <ul className="todo-list">
            {todoItems}
          </ul>
        </section>
      )}
      {(activeTodoCount || completedCount) && (
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={nowShowing}
          onClearCompleted={() => dispatch(clearCompleted())}
        />
      )}
    </div>
  );
};

export default App;