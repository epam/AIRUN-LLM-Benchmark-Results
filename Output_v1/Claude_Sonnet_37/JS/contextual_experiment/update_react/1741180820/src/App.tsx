import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TodoList from './components/TodoList';
import TodoInput from './components/TodoInput';
import TodoFooter from './components/TodoFooter';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';
import { useAppSelector } from './store';

const App: React.FC = () => {
  const todos = useAppSelector(state => state.todos.items);
  
  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;
  const hasTodos = todos.length > 0;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <TodoInput />
      </header>
      
      {hasTodos && (
        <Routes>
          <Route path="/" element={<TodoList filter={ALL_TODOS} />} />
          <Route path="/active" element={<TodoList filter={ACTIVE_TODOS} />} />
          <Route path="/completed" element={<TodoList filter={COMPLETED_TODOS} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
      
      {(activeTodoCount > 0 || completedCount > 0) && (
        <TodoFooter 
          activeTodoCount={activeTodoCount} 
          completedCount={completedCount} 
        />
      )}
    </div>
  );
};

export default App;