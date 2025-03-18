import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';

const App: React.FC = () => {
  const [filter, setFilter] = useState(ALL_TODOS);
  const todos = useSelector((state: RootState) => state.todos.todos);

  // Handle routing
  useEffect(() => {
    const handleRouteChange = () => {
      const route = window.location.hash.replace('#/', '') || '/';
      if (route === '/') {
        setFilter(ALL_TODOS);
      } else if (route === '/active') {
        setFilter(ACTIVE_TODOS);
      } else if (route === '/completed') {
        setFilter(COMPLETED_TODOS);
      }
    };

    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange(); // Initialize with current route

    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  return (
    <div className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <TodoInput />
      </header>

      {todos.length > 0 && (
        <>
          <TodoList filter={filter} />
          <TodoFooter filter={filter} setFilter={setFilter} />
        </>
      )}
    </div>
  );
};

export default App;