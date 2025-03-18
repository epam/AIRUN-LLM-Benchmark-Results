import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleAllTodos, selectFilteredTodos } from './todosSlice';
import { RootState } from '../../store';
import TodoItem from './components/TodoItem';
import TodoFooter from './components/TodoFooter';
import AddTodo from './components/AddTodo';

const Todos: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector(selectFilteredTodos);
  const allCompleted = useSelector(
    (state: RootState) => state.todos.todos.length > 0 && state.todos.todos.every((todo) => todo.completed)
  );

  const handleToggleAll = () => {
    dispatch(toggleAllTodos(!allCompleted));
  };

  return (
    <>
      <AddTodo />
      {useSelector((state: RootState) => state.todos.todos.length > 0) && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={allCompleted}
            onChange={handleToggleAll}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </section>
      )}
      {useSelector((state: RootState) => state.todos.todos.length > 0) && <TodoFooter />}
    </>
  );
};

export default Todos;
