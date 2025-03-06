import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TodoHeader from './components/TodoHeader';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import { setStatus } from './store/todoSlice';

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash.slice(1) || '/';
      if (path === '/') {
        dispatch(setStatus('all'));
      } else if (path === '/active') {
        dispatch(setStatus('active'));
      } else if (path === '/completed') {
        dispatch(setStatus('completed'));
      }
    };

    // Set initial status based on URL hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [dispatch]);

  return (
    <div>
      <section className="todoapp">
        <TodoHeader />
        <TodoList />
        <TodoFooter />
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Credits:
          <a href="http://twitter.com/cburgdorf">Christoph Burgdorf</a>,
          <a href="http://ericbidelman.com">Eric Bidelman</a>,
          <a href="http://jacobmumm.com">Jacob Mumm</a>,
          <a href="http://blog.igorminar.com">Igor Minar</a> and
          <a href="http://twitter.com/passy">Pascal Hartig</a>
        </p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    </div>
  );
};

export default App;