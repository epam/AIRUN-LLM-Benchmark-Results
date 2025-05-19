import { useAppSelector, useAppDispatch } from '../app/hooks';
import { Todo } from '../app/types';
import { toggleTodo, removeTodo, updateTodo } from '../app/todoSlice';
import TodoItem from './TodoItem';

const TodoList = () => {
  const todos = useAppSelector(state => state.todos.entities);
  const dispatch = useAppDispatch();

  return (
    <section className="main" hidden={!todos.length}>
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={todos.every(t => t.completed)}
        onChange={e => dispatch(toggleTodo({ id: 'all', completed: e.target.checked }))}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;