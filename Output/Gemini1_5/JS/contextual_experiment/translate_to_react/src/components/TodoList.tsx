```tsx
import React from 'react';
import { useAppSelector } from '../store/hooks';
import TodoItem from './TodoItem';
import { FilterValues } from '../types';

interface TodoListProps {
  filter: FilterValues;
}

const TodoList: React.FC<TodoListProps> = ({ filter }) => {
  const todos = useAppSelector((state) => state.todos.todos);

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case FilterValues.Active:
        return !todo.completed;
      case FilterValues.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <ul className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;

```