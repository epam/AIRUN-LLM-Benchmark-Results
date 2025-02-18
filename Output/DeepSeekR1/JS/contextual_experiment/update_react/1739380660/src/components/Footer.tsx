import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { TodoFilter } from '../types';
import { RootState } from '../store';
import { clearCompleted } from '../features/todos/todosSlice';

export const Footer = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);

  const activeTodoCount = todos.reduce((accum, todo) => 
    todo.completed ? accum : accum + 1
  , 0);

  const completedCount = todos.length - activeTodoCount;

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  if (todos.length === 0) return null;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {activeTodoCount === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? 'selected' : ''}
          >
            All
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/active"
            className={({ isActive }) => isActive ? 'selected' : ''}
          >
            Active
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/completed"
            className={({ isActive }) => isActive ? 'selected' : ''}
          >
            Completed
          </NavLink>
        </li>
      </ul>
      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};