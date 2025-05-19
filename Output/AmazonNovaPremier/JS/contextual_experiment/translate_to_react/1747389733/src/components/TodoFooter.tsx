import { useAppSelector, useAppDispatch } from '../app/hooks';
import { clearCompleted, selectFilteredTodos } from '../app/todoSlice';
import { FilterStatus } from '../app/types';

const TodoFooter = () => {
  const todos = useAppSelector(selectFilteredTodos);
  const dispatch = useAppDispatch();
  const remaining = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.length !== remaining;

  return (
    <footer className="footer" hidden={!todos.length}>
      <span className="todo-count">
        <strong>{remaining}</strong> item{remaining !== 1 ? 's' : ''} left
      </span>
      <ul className="filters">
        {(['All', 'Active', 'Completed'] as FilterStatus[]).map(status => (
          <li key={status}>
            <a
              href={`#/${status.toLowerCase()}`}
              className={useAppSelector(state => state.todos.filter) === status ? 'selected' : ''}
            >
              {status}
            </a>
          </li>
        ))}
      </ul>
      {hasCompleted && (
        <button className="clear-completed" onClick={() => dispatch(clearCompleted())}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;