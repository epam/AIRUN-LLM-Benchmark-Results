import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../store';
import { toggleAll } from '../todoSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import TodoItem from './TodoItem';

function TodoList() {
  const dispatch = useDispatch();
  const location = useLocation();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const editingId = useSelector((state: RootState) => state.todos.editingId);

  const getFilterType = () => {
    switch (location.pathname) {
      case '/active':
        return ACTIVE_TODOS;
      case '/completed':
        return COMPLETED_TODOS;
      default:
        return ALL_TODOS;
    }
  };

  const filterType = getFilterType();

  const shownTodos = todos.filter((todo) => {
    switch (filterType) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodoCount = todos.reduce((accum, todo) => {
    return todo.completed ? accum : accum + 1;
  }, 0);

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(event.target.checked));
  };

  if (todos.length === 0) {
    return null;
  }

  return (
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
        {shownTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            editing={editingId === todo.id}
          />
        ))}
      </ul>
    </section>
  );
}

export default TodoList;