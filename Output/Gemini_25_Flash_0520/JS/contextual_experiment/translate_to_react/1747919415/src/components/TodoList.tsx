import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { markAllTodos } from '../features/todos/todosSlice';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') {
      return !todo.completed;
    } else if (filter === 'completed') {
      return todo.completed;
    }
    return true;
  });

  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const allChecked = remainingCount === 0 && todos.length > 0;

  const handleMarkAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(markAllTodos(e.target.checked));
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
        checked={allChecked}
        onChange={handleMarkAll}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
