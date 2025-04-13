import React from 'react';
import TodoHeader from './components/TodoHeader';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';

const App: React.FC = () => {
  return (
    <section className="todoapp">
      <TodoHeader />
      <TodoList />
      <TodoFooter />
    </section>
  );
};

export default App;