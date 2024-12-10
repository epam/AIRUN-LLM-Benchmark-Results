import React from 'react';
import { useLocation } from 'react-router-dom';

const TodoFilter: React.FC = () => {
  const location = useLocation();

  return (
    <ul className="filters">
      <li>
        <a className={location.pathname === '/' ? 'selected' : ''} href="/">All</a>
      </li>
      <li>
        <a className={location.pathname === '/active' ? 'selected' : ''} href="/active">Active</a>
      </li>
      <li>
        <a className={location.pathname === '/completed' ? 'selected' : ''} href="/completed">Completed</a>
      </li>
    </ul>
  );
};

export default TodoFilter;