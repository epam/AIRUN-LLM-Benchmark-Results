import { useSelector, useDispatch } from 'react-redux';
import { toggleTodo, removeTodo } from '../store';

const TodoList = ({
  todos,
  onToggleTodo,
  onRemoveTodo,
}: {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onRemoveTodo: (id: string) => void;
}) => {
  const dispatch = useDispatch();

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          <div className="view">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch(toggleTodo(todo.id))}
            />
            <label>{todo.title}</label>
            <button onClick={() => dispatch(removeTodo(todo.id))}>X</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;