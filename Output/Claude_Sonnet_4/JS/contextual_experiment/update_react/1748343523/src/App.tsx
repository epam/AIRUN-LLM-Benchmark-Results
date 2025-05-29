import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TodoApp } from './components/TodoApp';

const App: React.FC = () => {
  return (
    <div className="todoapp">
      <Routes>
        <Route path="/" element={<TodoApp />} />
        <Route path="/:filter" element={<TodoApp />} />
      </Routes>
    </div>
  );
};

export default App;