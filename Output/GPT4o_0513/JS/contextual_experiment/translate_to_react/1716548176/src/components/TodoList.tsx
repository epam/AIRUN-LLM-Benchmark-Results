import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearCompleted, markAll } from '../store/todoSlice';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const remainingCount = todos.filter(todo => !todo.completed).length;
  const allChecked = remainingCount === 0;
  const dispatch = useDispatch();

  return (
    <section className="main">
      {todos.length > 0 && (
        <>
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={allChecked}
            onChange={(e) => dispatch(markAll(e.target.checked))}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
        </>
      )}
      <ul className="todo-list">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
      {todos.length > 0 && (
        <footer className="footer">
          <span className="todo-count">
            <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item' : 'items'} left
          </span>
          <ul className="filters">
            <li>
              <a href="#/" className={window.location.hash === '#/' ? 'selected' : ''}>All</a>
            </li>
            <li>
              <a href="#/active" className={window.location.hash === '#/active' ? 'selected' : ''}>Active</a>
            </li>
            <li>
              <a href="#/completed" className={window.location.hash === '#/completed' ? 'selected' : ''}>Completed</a>
            </li>
          </ul>
          {remainingCount < todos.length && (
            <button className="clear-completed" onClick={() => dispatch(clearCompleted())}>
              Clear completed
            </button>
          )}
        </footer>
      )}
    </section>
  );
};

export default TodoList;