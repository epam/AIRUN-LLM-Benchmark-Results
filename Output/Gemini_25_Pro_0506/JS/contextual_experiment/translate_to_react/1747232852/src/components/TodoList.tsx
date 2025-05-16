import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { markAllTodos } from '../features/todos/todosSlice';
import { FilterStatus, Todo } from '../features/todos/types';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const currentFilter = useSelector((state: RootState) => state.todos.filter);

  const filteredTodos = todos.filter(todo => {
    if (currentFilter === FilterStatus.Active) {
      return !todo.completed;
    }
    if (currentFilter === FilterStatus.Completed) {
      return todo.completed;
    }
    return true;
  });

  const allChecked = todos.length > 0 && todos.every(todo => todo.completed);

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
        {filteredTodos.map((todo: Todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
