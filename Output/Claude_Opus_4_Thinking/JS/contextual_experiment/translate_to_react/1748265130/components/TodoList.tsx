import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { toggleAll } from '../store/todoSlice';
import TodoItem from './TodoItem';
import { Todo } from '../types/todo';

interface TodoListProps {}

const TodoList: React.FC<TodoListProps> = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);

  const filteredTodos = todos.filter((todo: Todo) => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  if (todos.length === 0) {
    return null;
  }

  const handleToggleAll = () => {
    dispatch(toggleAll(!allCompleted));
  };

  return (
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
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;