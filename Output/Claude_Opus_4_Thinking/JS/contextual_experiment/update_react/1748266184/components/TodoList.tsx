import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { toggleAll } from '../store/todosSlice';
import { TodoItem } from './TodoItem';
import { ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { ITodo } from '../types';

interface TodoListProps {
  filter: string;
}

export const TodoList: React.FC<TodoListProps> = ({ filter }) => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.items);
  const editingId = useSelector((state: RootState) => state.todos.editingId);

  const filteredTodos = todos.filter((todo: ITodo) => {
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

  if (todos.length === 0) {
    return null;
  }

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={handleToggleAll}
        checked={allCompleted}
      />
      <label htmlFor="toggle-all">
        Mark all as complete
      </label>
      <ul className="todo-list">
        {filteredTodos.map((todo: ITodo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            editing={editingId === todo.id}
          />
        ))}
      </ul>
    </section>
  );
};