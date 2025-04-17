import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from "../../constants";
import { clearCompleted, setFilter } from "./todosSlice";
import { pluralize } from "../../utils";
import { RootState } from "../../types";

const TodoFooter: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.items);
  const filter = useSelector((state: RootState) => state.todos.filter);

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;
  const activeTodoWord = pluralize(activeCount, 'item');

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const handleFilterChange = (newFilter: string) => () => {
    dispatch(setFilter(newFilter));
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <button
            className={filter === ALL_TODOS ? 'selected' : ''}
            onClick={handleFilterChange(ALL_TODOS)}
          >
            All
          </button>
        </li>
        <li>
          <button
            className={filter === ACTIVE_TODOS ? 'selected' : ''}
            onClick={handleFilterChange(ACTIVE_TODOS)}
          >
            Active
          </button>
        </li>
        <li>
          <button
            className={filter === COMPLETED_TODOS ? 'selected' : ''}
            onClick={handleFilterChange(COMPLETED_TODOS)}
          >
            Completed
          </button>
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

export default TodoFooter;
