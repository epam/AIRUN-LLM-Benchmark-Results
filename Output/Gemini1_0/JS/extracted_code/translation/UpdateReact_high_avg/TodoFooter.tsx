import { useSelector } from "react-redux";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from "./constants";

const TodoFooter = () => {
  const count = useSelector((state) => state.todos.length);
  const completedCount = useSelector((state) =>
    state.todos.filter((todo) => todo.completed).length
  );
  const nowShowing = useSelector((state) => state.nowShowing);

  const handleClearCompleted = () => {
    // TODO: Implement clear completed
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> item{count !== 1 && "s"} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={nowShowing === ALL_TODOS ? "selected" : ""}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={nowShowing === ACTIVE_TODOS ? "selected" : ""}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={nowShowing === COMPLETED_TODOS ? "selected" : ""}
          >
            Completed
          </a>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;