import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleAllTodos } from '../store/todoSlice';
import TodoItem from './TodoItem';
import { filterTodos } from '../utils/filterTodos';

interface TodoListProps {
  filter: string;
}

const TodoList: React.FC<TodoListProps> = ({ filter }) => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filteredTodos = filterTodos(todos, filter);

  if (todos.length === 0) {
    return null;
  }

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const allCompleted = activeTodoCount === 0;

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAllTodos(e.target.checked));
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