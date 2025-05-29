import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';

const TodoApp: React.FC<{ filter: string }> = ({ filter }) => {
  return (
    <div>
      <TodoHeader />
      <TodoList filter={filter} />
      <TodoFooter />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<TodoApp filter={ALL_TODOS} />} />
      <Route path="/active" element={<TodoApp filter={ACTIVE_TODOS} />} />
      <Route path="/completed" element={<TodoApp filter={COMPLETED_TODOS} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};