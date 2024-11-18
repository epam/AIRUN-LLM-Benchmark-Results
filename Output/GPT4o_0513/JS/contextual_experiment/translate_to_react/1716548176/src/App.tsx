import React from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

const App: React.FC = () => {
  return (
    <section className="todoapp">
      <TodoForm />
      <TodoList />
    </section>
  );
};

export default App;
