import React, { useEffect } from 'react';
import { useAppSelector } from '../store';
import Header from './Header';
import TodoList from './TodoList';
import Footer from './Footer';

const App: React.FC = () => {
  const { todos, status } = useAppSelector((state) => state.todos);
  
  useEffect(() => {
    // Sync URL with filter status
    const path = status === 'all' ? '/' : `/${status}`;
    window.location.hash = path;
  }, [status]);

  // Handle initial route
  useEffect(() => {
    if (window.location.hash === '') {
      window.location.hash = '/';
    }
  }, []);
  
  return (
    <>
      <section className="todoapp">
        <Header />
        {todos.length > 0 && <TodoList />}
        {todos.length > 0 && <Footer />}
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>Credits:
          <a href="http://twitter.com/cburgdorf">Christoph Burgdorf</a>,
          <a href="http://ericbidelman.com">Eric Bidelman</a>,
          <a href="http://jacobmumm.com">Jacob Mumm</a>,
          <a href="http://blog.igorminar.com">Igor Minar</a> and
          <a href="http://twitter.com/passy">Pascal Hartig</a>
        </p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    </>
  );
};

export default App;
