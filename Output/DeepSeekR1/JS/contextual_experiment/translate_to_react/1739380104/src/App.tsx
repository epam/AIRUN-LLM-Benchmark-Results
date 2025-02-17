import React from 'react';
import { useSelector } from 'react-redux';
import { Header } from './components/Header';
import { MainSection } from './components/MainSection';
import { Footer } from './components/Footer';
import { selectTodos } from './store/todoSlice';
import { RootState } from './types';

export const App = () => {
  const todos = useSelector((state: RootState) => state.todos);

  return (
    <section className="todoapp">
      <Header />
      {todos.length > 0 && <MainSection />}
      {todos.length > 0 && <Footer />}
    </section>
  );
};
