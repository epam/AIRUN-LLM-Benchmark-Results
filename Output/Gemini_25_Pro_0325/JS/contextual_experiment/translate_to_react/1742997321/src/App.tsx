import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import { setFilter } from './store/todosSlice';
import { AppDispatch } from './store/store';
import { FilterStatus } from './types';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, ''); // More robust hash parsing
      let filter: FilterStatus = 'all';
      if (hash === 'active') {
        filter = 'active';
      } else if (hash === 'completed') {
        filter = 'completed';
      }
      dispatch(setFilter(filter));
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial filter setup based on current hash

    // Set initial hash if none exists
    if (!window.location.hash) {
        window.location.hash = '#/';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [dispatch]);

  return (
    <>
      <section className="todoapp">
        <Header />
        <TodoList />
        <Footer />
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>Created by the TodoMVC Team</p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    </>
  );
};

export default App;
