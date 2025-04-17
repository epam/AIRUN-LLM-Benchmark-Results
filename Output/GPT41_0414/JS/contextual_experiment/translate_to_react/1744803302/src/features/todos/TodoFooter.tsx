import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearCompleted, setFilter } from "./todosSlice";

const TodoFooter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, filter } = useAppSelector(state => state.todos);
  const remainingCount = items.filter(t => !t.completed).length;
  const completedCount = items.length - remainingCount;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? "item left" : "items left"}
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={filter === "all" ? "selected" : ""}
            onClick={e => {
              e.preventDefault();
              dispatch(setFilter("all"));
            }}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={filter === "active" ? "selected" : ""}
            onClick={e => {
              e.preventDefault();
              dispatch(setFilter("active"));
            }}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={filter === "completed" ? "selected" : ""}
            onClick={e => {
              e.preventDefault();
              dispatch(setFilter("completed"));
            }}
          >
            Completed
          </a>
        </li>
      </ul>
      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={() => dispatch(clearCompleted())}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;
