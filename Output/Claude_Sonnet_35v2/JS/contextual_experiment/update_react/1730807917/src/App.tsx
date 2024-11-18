import React from 'react';
import TodoList from './components/TodoList/TodoList';
import TodoHeader from './components/TodoHeader/TodoHeader';
import TodoFooter from './components/TodoFooter/TodoFooter';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

const App: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.items);

  return (
    <div className="todoapp">
      <TodoHeader />
      {todos.length > 0 && (
        <>
          <TodoList />
          <TodoFooter />
        </>
      )}
    </div>
  );
};

export default App;