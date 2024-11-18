import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import TodoItem from './TodoItem';
import { toggleAll } from '../store/todoSlice';

const TodoList: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todo.todos);
  const statusFilter = useSelector((state: RootState) => state.todo.statusFilter);

  const filteredTodos = todos.filter(todo => {
    if (statusFilter === '/active') {
      return !todo.completed;
    } else if (statusFilter === '/completed') {
      return todo.completed;
    } else {
      return true;
    }
  });

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(e.target.checked));
  };

  if (todos.length === 0) {
    return null;
  }

  return (
    <section className=\"main\">
      <input
        id=\"toggle-all\"
        className=\"toggle-all\"
        type=\"checkbox\"
        checked={allCompleted}
        onChange={handleToggleAll}
      />
      <label htmlFor=\"toggle-all\">Mark all as complete</label>
      <ul className=\"todo-list\">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
