import React, { useState, useEffect, ChangeEvent } from 'react';
import { nanoid } from 'nanoid';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  addTodo as addTodoAction,
  toggleAll as toggleAllAction,
  toggleTodo as toggleTodoAction,
  destroyTodo as destroyTodoAction,
  editTodo as editTodoAction,
  saveTodo as saveTodoAction,
  clearCompleted as clearCompletedAction,
  VisibilityFilters,
} from '../store/todosSlice';
import TodoItem from './TodoItem';
import TodoFooter from './Footer';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const visibilityFilter = useSelector((state: RootState) => state.todos.visibilityFilter);
  const [newTodoText, setNewTodoText] = useState('');

  const handleNewTodoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();

    const val = newTodoText.trim();

    if (val) {
      dispatch(
        addTodoAction({
          id: nanoid(),
          title: val,
          completed: false,
        })
      );
      setNewTodoText('');
    }
  };

  const toggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAllAction(event.target.checked));
  };

  const clearCompleted = () => {
    dispatch(clearCompletedAction());
  };

  const shownTodos = todos.filter((todo) => {
    switch (visibilityFilter) {
      case VisibilityFilters.SHOW_ACTIVE:
        return !todo.completed;
      case VisibilityFilters.SHOW_COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodoCount = todos.reduce((accum, todo) => (todo.completed ? accum : accum + 1), 0);
  const completedCount = todos.length - activeTodoCount;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
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
            {shownTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={() => dispatch(toggleTodoAction(todo.id))}
                onDestroy={() => dispatch(destroyTodoAction(todo.id))}
                onEdit={() => dispatch(editTodoAction(todo.id))}
                onSave={(text) => dispatch(saveTodoAction({ id: todo.id, text }))}
              />
            ))}
          </ul>
        </section>
      )}
      {(activeTodoCount > 0 || completedCount > 0) && (
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          onClearCompleted={clearCompleted}
        />
      )}
    </div>
  );
};

export default App;
