import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { toggleAllComplete } from '../store/todosSlice';
import TodoList from './TodoList';

const MainSection: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos);
  const remainingCount = useSelector((state: RootState) =>
    state.todos.filter(todo => !todo.completed).length
  );

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAllComplete(event.target.checked));
  };

  if (todos.length === 0) {
    return null;
  }

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={remainingCount === 0 && todos.length > 0}
        onChange={handleToggleAll}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <TodoList />
    </section>
  );
};

export default MainSection;
