import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/store';
import { toggleAll } from '../store/todoSlice';
import { TodoItem } from './TodoItem';
import { FilterType } from '../types/todo';

type TodoListProps = {
  filter: FilterType;
};

export const TodoList: React.FC<TodoListProps> = ({ filter }) => {
  const todos = useAppSelector(state => state.todos);
  const dispatch = useAppDispatch();
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);
  
  const handleToggleAll = () => {
    dispatch(toggleAll(!allCompleted));
  };
  
  return (
    <section className="main" style={{ display: todos.length ? 'block' : 'none' }}>
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={allCompleted}
        onChange={handleToggleAll}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};
