import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearCompleted } from '../slices/todosSlice';
import { Link, useLocation } from 'react-router-dom';

const TodoFooter: React.FC = () => {
    const dispatch = useDispatch();
    const todos = useSelector((state: RootState) => state.todos);
    const remainingCount = todos.filter(todo => !todo.completed).length;
    const completedCount = todos.length - remainingCount;
    const location = useLocation();
    const currentFilter = location.pathname;

    const handleClearCompleted = () => {
        dispatch(clearCompleted());
    };

    if (todos.length === 0) {
        return null;
    }

    return (
        <footer className="footer">
            <span className="todo-count">
                <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item left' : 'items left'}
            </span>
            <ul className="filters">
                <li>
                    <Link to="/" className={currentFilter === '/' ? 'selected' : ''}>
                        All
                    </Link>
                </li>
                <li>
                    <Link to="/active" className={currentFilter === '/active' ? 'selected' : ''}>
                        Active
                    </Link>
                </li>
                <li>
                    <Link to="/completed" className={currentFilter === '/completed' ? 'selected' : ''}>
                        Completed
                    </Link>
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