import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TodoItem from '../TodoItem/TodoItem';
import { toggleAllTodos } from '../../store/todoSlice';
import { RootState } from '../../store/store';
import { FILTER_MODES } from '../../constants/constants';

const TodoList: React.FC = () => {
  const dispatch = useDispatch();
  const { items: todos, filter } = useSelector((state: RootState) => state.todos);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FILTER_MODES.ACTIVE:
        return !todo.completed;
      case FILTER_MODES.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodoCount = todos.filter(todo => !todo.completed).length;

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={(e) => dispatch(toggleAllTodos(e.target.checked))}
        checked={activeTodoCount === 0}
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