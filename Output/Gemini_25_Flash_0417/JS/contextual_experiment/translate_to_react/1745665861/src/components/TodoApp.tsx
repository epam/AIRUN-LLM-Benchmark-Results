import React from 'react';
import Header from './Header';
import MainSection from './MainSection';
import Footer from './Footer';

const TodoApp: React.FC = () => {
  return (
    <section className="todoapp">
      <Header />
      <MainSection />
      <Footer />
    </section>
  );
};

export default TodoApp;
