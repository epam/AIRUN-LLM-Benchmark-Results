```tsx
import React, { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { markAll } from '../store/todosSlice';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const todos = useAppSelector((state) => state.todos.todos);
  const filter = useAppSelector((state) => state.todos.filter);
  const dispatch = useAppDispatch();

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const allChecked = todos.length > 0 && todos.every((todo) => todo.completed);

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(markAll(e.target.checked));
  };

  return (
    <section className="main">
      {todos.length > 0 && (
        <>
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
        </>
      )}
    </section>
  );
};

export default TodoList;
```