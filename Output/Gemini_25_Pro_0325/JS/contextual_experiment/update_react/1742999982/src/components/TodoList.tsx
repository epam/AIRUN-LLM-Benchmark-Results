import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TodoItem from './TodoItem';
import { toggleAllTodos, selectFilteredTodos, selectActiveTodosCount } from '../features/todos/todosSlice';
import { RootState } from '../store/store';

const TodoList: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector(selectFilteredTodos);
  const activeTodoCount = useSelector(selectActiveTodosCount);
  const totalTodos = useSelector((state: RootState) => state.todos.length);

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAllTodos(event.target.checked));
  };

  if (totalTodos === 0) {
    return null;
  }

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={handleToggleAll}
        checked={activeTodoCount === 0 && totalTodos > 0}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
