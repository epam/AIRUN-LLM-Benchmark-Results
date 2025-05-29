import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../store/store';
import {
  addTodo,
  toggleTodo,
  destroyTodo,
  editTodo,
  saveTodo,
  cancelEdit,
  toggleAll,
  clearCompleted,
  setFilter
} from '../store/todoSlice';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
import { TodoFooter } from './TodoFooter';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { Todo } from '../types';

export const TodoApp: React.FC = () => {
  const dispatch = useDispatch();
  const { filter: routeFilter } = useParams<{ filter?: string }>();
  const { todos, editingId } = useSelector((state: RootState) => state.todos);

  const currentFilter = routeFilter || ALL_TODOS;

  React.useEffect(() => {
    dispatch(setFilter(currentFilter));
  }, [currentFilter, dispatch]);

  const shownTodos = useMemo(() => {
    return todos.filter((todo: Todo) => {
      switch (currentFilter) {
        case ACTIVE_TODOS:
          return !todo.completed;
        case COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, currentFilter]);

  const activeTodoCount = useMemo(() => {
    return todos.reduce((accum, todo) => {
      return todo.completed ? accum : accum + 1;
    }, 0);
  }, [todos]);

  const completedCount = todos.length - activeTodoCount;

  const handleAddTodo = (title: string) => {
    dispatch(addTodo(title));
  };

  const handleToggle = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const handleDestroy = (id: string) => {
    dispatch(destroyTodo(id));
  };

  const handleEdit = (id: string) => {
    dispatch(editTodo(id));
  };

  const handleSave = (id: string, text: string) => {
    dispatch(saveTodo({ id, title: text }));
  };

  const handleCancel = () => {
    dispatch(cancelEdit());
  };

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(event.target.checked));
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const main = todos.length ? (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={handleToggleAll}
        checked={activeTodoCount === 0}
      />
      <label htmlFor="toggle-all">
        Mark all as complete
      </label>
      <TodoList
        todos={shownTodos}
        editingId={editingId}
        onToggle={handleToggle}
        onDestroy={handleDestroy}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </section>
  ) : null;

  const footer = (activeTodoCount || completedCount) ? (
    <TodoFooter
      count={activeTodoCount}
      completedCount={completedCount}
      filter={currentFilter}
      onClearCompleted={handleClearCompleted}
    />
  ) : null;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <TodoInput onAddTodo={handleAddTodo} />
      </header>
      {main}
      {footer}
    </div>
  );
};