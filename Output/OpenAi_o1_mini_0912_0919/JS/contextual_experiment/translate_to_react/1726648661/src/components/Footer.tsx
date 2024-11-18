import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { clearCompleted } from '../slices/todoSlice';
import { RootState, AppDispatch } from '../store';

const Footer: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const todos = useSelector((state: RootState) => state.todos);
    const remainingCount = todos.filter(todo => !todo.completed).length;
    const doneCount = todos.length - remainingCount;

    return (
        <footer className="footer" style={{ display: todos.length ? 'block' : 'none' }}>
            <span className="todo-count"><strong>{remainingCount}</strong> {remainingCount === 1 ? 'item' : 'items'} left</span>
            <ul className="filters">
                <li>
                    <Link to="/" className={location.pathname === '/' ? 'selected' : ''}>All</Link>
                </li>
                <li>
                    <Link to="/active" className={location.pathname === '/active' ? 'selected' : ''}>Active</Link>
                </li>
                <li>
                    <Link to="/completed" className={location.pathname === '/completed' ? 'selected' : ''}>Completed</Link>
                </li>
            </ul>
            {doneCount > 0 && (
                <button className="clear-completed" onClick={() => dispatch(clearCompleted())}>
                    Clear completed
                </button>
            )}
        </footer>
    );
};

export default Footer;