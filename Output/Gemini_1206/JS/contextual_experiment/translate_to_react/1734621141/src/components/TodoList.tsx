import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleAll } from '../slices/todoSlice';
import TodoItem from './TodoItem';
import { Filter } from '../types';

interface Props {
  activeFilter: Filter;
}

const TodoList: React.FC<Props> = ({ activeFilter }) => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos);
  const allCompleted = useSelector((state: RootState) => state.todos.every((todo) => todo.completed));

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
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} activeFilter={activeFilter} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
