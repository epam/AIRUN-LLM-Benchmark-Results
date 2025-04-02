import React from 'react';
import Header from './components/Header';
import MainSection from './components/MainSection';
import Footer from './components/Footer';
import './styles/base.css';
import './styles/index.css';

const App: React.FC = () => {
  return (
    <section className="todoapp">
      <Header />
      <MainSection />
      <Footer />
    </section>
  );
};

export default App;