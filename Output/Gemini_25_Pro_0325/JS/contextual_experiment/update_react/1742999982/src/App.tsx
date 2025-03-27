import React from 'react';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div>
      <Header />
      <TodoList />
      <Footer />
    </div>
  );
};

export default App;
