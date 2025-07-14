import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTodos, setStatus, selectTodos } from './features/todos/todoSlice';
import Header from './components/Header';
import MainSection from './components/MainSection';
import Footer from './components/Footer';

const STORAGE_ID = 'todos-react';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector(selectTodos);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_ID) || '[]') as Todo[];
    dispatch(setTodos(saved));
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const handleHashChange = () => {
      let path = window.location.hash.replace('#/', '').toLowerCase();
      if (path === '') {
        path = 'all';
      }
      if (['all', 'active', 'completed'].includes(path)) {
        dispatch(setStatus(path));
      } else {
        dispatch(setStatus('all'));
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [dispatch]);

  return (
    <section className="todoapp">
      <Header />
      <MainSection />
      <Footer />
    </section>
  );
};

export default App;