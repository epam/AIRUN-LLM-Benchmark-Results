import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TodoApp from './components/TodoApp';

function App() {
  return (
    <div className="todoapp">
      <Routes>
        <Route path="/" element={<TodoApp />} />
        <Route path="/active" element={<TodoApp />} />
        <Route path="/completed" element={<TodoApp />} />
      </Routes>
    </div>
  );
}

export default App;