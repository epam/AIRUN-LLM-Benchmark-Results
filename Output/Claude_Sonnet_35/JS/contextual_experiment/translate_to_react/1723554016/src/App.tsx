import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import { FilterStatus } from './types/todo';

const App: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const todos = useSelector((state: RootState) => state.todos.list);

  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <TodoInput />
      </header>
      <TodoList filterStatus={filterStatus} />
      {todos.length > 0 && (
        <TodoFooter
          activeCount={activeCount}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
      )}
    </div>
  );
};

export default App;
