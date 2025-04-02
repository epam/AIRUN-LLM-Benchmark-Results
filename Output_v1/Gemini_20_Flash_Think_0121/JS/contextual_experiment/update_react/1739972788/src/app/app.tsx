import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TodoItem from '../components/TodoItem';
import TodoFooter from '../components/TodoFooter';
import {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  clearCompletedTodos,
  setFilter,
  setEditingTodoId,
} from './todoSlice';
import { RootState } from './store';
import { ACTIVE_TODOS, ALL_TODOS, COMPLETED_TODOS, ENTER_KEY } from '../constants';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);
  const editingTodoId = useSelector((state: RootState) => state.todos.editingTodoId);

  const handleNewTodoKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();
    const val = event.currentTarget.value.trim();
    if (val) {
      dispatch(addTodo(val));
      event.currentTarget.value = '';
    }
  }, [dispatch]);

  const handleToggleAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    todos.forEach(todo => dispatch(toggleTodo(todo.id)));
  }, [dispatch, todos]);

  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompletedTodos());
  }, [dispatch]);

  const handleTodoEdit = useCallback((id: string) => {
    dispatch(setEditingTodoId(id));
  }, [dispatch]);

  const handleTodoSave = useCallback((id: string, text: string) => {
    dispatch(editTodo({ id, text }));
  }, [dispatch]);

  const handleTodoCancel = useCallback(() => {
    dispatch(setEditingTodoId(null));
  }, [dispatch]);

  const shownTodos = todos.filter(todo => {
    switch (filter) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

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
          <label htmlFor="toggle-all">
            Mark all as complete
          </label>
          <ul className="todo-list">
            {shownTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={() => dispatch(toggleTodo(todo.id))}
                onDestroy={() => dispatch(deleteTodo(todo.id))}
                onEdit={() => handleTodoEdit(todo.id)}
                editing={editingTodoId === todo.id}
                onSave={(text) => handleTodoSave(todo.id, text)}
                onCancel={handleTodoCancel}
              />
            ))}
          </ul>
        </section>
      )}
      {(activeTodoCount > 0 || completedCount > 0) && (
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={filter}
          onClearCompleted={handleClearCompleted}
        />
      )}
    </div>
  );
};

export default App;