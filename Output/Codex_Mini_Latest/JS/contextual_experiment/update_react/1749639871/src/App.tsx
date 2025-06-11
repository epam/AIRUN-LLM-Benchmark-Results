import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TodosPage } from './features/todos/TodosPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path='/:filter?' element={<TodosPage />} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

export default App;
