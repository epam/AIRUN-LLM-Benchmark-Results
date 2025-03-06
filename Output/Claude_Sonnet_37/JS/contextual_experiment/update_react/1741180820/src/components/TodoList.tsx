import React from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { toggleAll } from '../store/todoSlice';
import TodoItem from './TodoItem';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

interface TodoListProps {
  filter: string;
}

const TodoList: React.FC<TodoListProps> = ({ filter }) => {
  const todos = useAppSelector(state => state.todos.items);
  const dispatch = useAppDispatch();

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const allCompleted = todos.length > 0 && activeTodoCount === 0;

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(e.target.checked));
  };

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={handleToggleAll}
        checked={allCompleted}
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

export default TodoList;