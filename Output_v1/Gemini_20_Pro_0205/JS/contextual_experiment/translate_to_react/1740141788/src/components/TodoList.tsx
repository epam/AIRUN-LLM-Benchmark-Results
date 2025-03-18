import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { markAll } from '../store/todoSlice';
import TodoItem from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  activeFilter: string;
}

const TodoList: React.FC<Props> = ({ activeFilter }) => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos);

  const filteredTodos = todos.filter((todo: Todo) => {
    if (activeFilter === 'active') {
      return !todo.completed;
    }
    if (activeFilter === 'completed') {
      return todo.completed;
    }
    return true;
  });

  const allChecked = todos.length > 0 && todos.every((todo) => todo.completed);

  const handleToggleAll = () => {
    dispatch(markAll(!allChecked));
  };

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={allChecked}
        onChange={handleToggleAll}
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