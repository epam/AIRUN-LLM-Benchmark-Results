import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TodoHeader from './TodoHeader';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';
import { setFilter } from '../features/todos/todosSlice';

const TodoApp: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const applyFilterFromHash = (): void => {
      const hash = window.location.hash;
      const filter = hash === '#/active' ? 'active' : hash === '#/completed' ? 'completed' : 'all';
      dispatch(setFilter(filter));
    };

    applyFilterFromHash();
    window.addEventListener('hashchange', applyFilterFromHash);
    return () => {
      window.removeEventListener('hashchange', applyFilterFromHash);
    };
  }, [dispatch]);

  return (
    <>
      <section className="todoapp">
        <TodoHeader />
        <TodoList />
        <TodoFooter />
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Credits: <a href="http://twitter.com/cburgdorf">Christoph Burgdorf</a>,{' '}
          <a href="http://ericbidelman.com">Eric Bidelman</a>,{' '}
          <a href="http://jacobmumm.com">Jacob Mumm</a>,{' '}
          <a href="http://blog.igorminar.com">Igor Minar</a> and{' '}
          <a href="http://twitter.com/passy">Pascal Hartig</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>
  );
};

export default TodoApp;
