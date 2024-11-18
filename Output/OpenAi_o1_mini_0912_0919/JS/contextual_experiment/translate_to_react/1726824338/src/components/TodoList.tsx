```typescript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import TodoItem from './TodoItem';
import { toggleAll } from '../store/todosSlice';

const TodoList: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const statusFilter = useSelector((state: RootState) => state.todos.statusFilter);

  const filteredTodos = React.useMemo(() => {
    if (statusFilter === 'active') {
      return todos.filter(todo => !todo.completed);
    }
    if (statusFilter === 'completed') {
      return todos.filter(todo => todo.completed);
    }
    return todos;
  }, [todos, statusFilter]);

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
        checked={todos.every(todo => todo.completed)}
        onChange={handleToggleAll}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} id={todo.id} title={todo.title} completed={todo.completed} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
```