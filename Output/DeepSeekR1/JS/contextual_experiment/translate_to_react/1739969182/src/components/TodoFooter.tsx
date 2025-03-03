import { NavLink, useLocation } from 'react-router-dom';

type TodoFooterProps = {
  todos: Todo[];
  onClearCompleted: () => void;
};

export default function TodoFooter({ todos, onClearCompleted }: TodoFooterProps) {
  const location = useLocation();
  const remaining = todos.filter(todo => !todo.completed).length;
  const doneCount = todos.length - remaining;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remaining}</strong>
        {remaining === 1 ? ' item left' : ' items left'}
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
      {doneCount > 0 && (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
}
