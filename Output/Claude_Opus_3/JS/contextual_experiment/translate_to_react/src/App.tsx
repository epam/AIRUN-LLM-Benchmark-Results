import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { completeAllTodos, clearCompletedTodos, setVisibilityFilter } from './store/todoSlice';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';

const App: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch();

  const handleToggleAll = () => {
    const allCompleted = todos.every((todo) => todo.completed);
    if (allCompleted) {
      dispatch(clearCompletedTodos());
    } else {
      dispatch(completeAllTodos());
    }
  };

  return (
    <section className="todoapp">
      <Header />
      {todos.length > 0 && (
        <>
          <section className="main">
            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              checked={todos.every((todo) => todo.completed)}
              onChange={handleToggleAll}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <TodoList />
          </section>
          <Footer />
        </>
      )}
    </section>
  );
};

export default App;
