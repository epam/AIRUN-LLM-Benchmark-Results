import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppSelector } from './store/store';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { FilterType } from './types/todo';

export const App: React.FC = () => {
  const todos = useAppSelector(state => state.todos);
  
  return (
    <div className="todoapp">
      <Header />
      <Routes>
        <Route path="/" element={<TodoList filter="all" />} />
        <Route path="/active" element={<TodoList filter="active" />} />
        <Route path="/completed" element={<TodoList filter="completed" />} />
      </Routes>
      {todos.length > 0 && <TodoFooter />}
    </div>
  );
};
