import React, { useState, useEffect } from 'react';
import { TodoHeader } from './TodoHeader';
import { TodoList } from './TodoList';
import { TodoFooter } from './TodoFooter';
import { FilterType } from '../types/todo';

export const TodoApp: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/active') {
        setFilter('active');
      } else if (hash === '#/completed') {
        setFilter('completed');
      } else {
        setFilter('all');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <section className="todoapp">
      <TodoHeader />
      <TodoList filter={filter} />
      <TodoFooter currentFilter={filter} />
    </section>
  );
};
