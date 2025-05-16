import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import { setFilter } from './features/todos/todosSlice';
import { FilterStatus } from './features/todos/types';
import { AppDispatch, RootState } from './store/store';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => state.todos.todos);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/active') {
        dispatch(setFilter(FilterStatus.Active));
      } else if (hash === '#/completed') {
        dispatch(setFilter(FilterStatus.Completed));
      } else {
        dispatch(setFilter(FilterStatus.All));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); 

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [dispatch]);

  return (
    <>
      <section className="todoapp">
        <Header />
        {todos.length > 0 && (
          <>
            <TodoList />
            <Footer />
          </>
        )}
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
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>
  );
};

export default App;
