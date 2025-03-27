import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { toggleAll } from '../store/todosSlice';
import TodoItem from './TodoItem';
import { Todo } from '../types';

const TodoList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, filter } = useSelector((state: RootState) => state.todos);

  const filteredTodos = todos.filter((todo: Todo) => {
    if (filter === 'active') {
      return !todo.completed;
    }
    if (filter === 'completed') {
      return todo.completed;
    }
    return true; // 'all'
  });

  const remainingCount = todos.filter(todo => !todo.completed).length;

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(e.target.checked));
  };

  if (todos.length === 0) {
    // Render nothing if there are no todos, including the toggle-all checkbox
    return null;
  }

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={remainingCount === 0} // Checked if no items are remaining
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

export default TodoList;
