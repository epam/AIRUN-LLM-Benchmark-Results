import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearCompleted, selectItemsLeft, selectFilter } from '../store/todoSlice';

export const Footer = () => {
  const dispatch = useDispatch();
  const itemsLeft = useSelector(selectItemsLeft);
  const filter = useSelector(selectFilter);

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{itemsLeft}</strong> item{itemsLeft !== 1 ? 's' : ''} left
      </span>
      
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={filter === 'all' ? 'selected' : ''}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setFilter('all'));
            }}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={filter === 'active' ? 'selected' : ''}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setFilter('active'));
            }}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={filter === 'completed' ? 'selected' : ''}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setFilter('completed'));
            }}
          >
            Completed
          </a>
        </li>
      </ul>
      
      <button
        className="clear-completed"
        onClick={() => dispatch(clearCompleted())}
        hidden={itemsLeft === useSelector((state: RootState) => state.todos.length)}
      >
        Clear completed
      </button>
    </footer>
  );
};