import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from './hooks';
import { setFilter } from './features/todos/todosSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';
import TodoHeader from './components/TodoHeader';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/active':
        dispatch(setFilter(ACTIVE_TODOS));
        break;
      case '/completed':
        dispatch(setFilter(COMPLETED_TODOS));
        break;
      default:
        dispatch(setFilter(ALL_TODOS));
    }
  }, [location.pathname, dispatch]);

  return (
    <div className="todoapp">
      <TodoHeader />
      <TodoList />
      <TodoFooter />
    </div>
  );
};

export default App;
