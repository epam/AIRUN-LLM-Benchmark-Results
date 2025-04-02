import TodoItem from './TodoItem';
import { Todo } from '../store/todoSlice';

type TodoListProps = {
  todos: Todo[];
  onRemoveTodo: (id: string) => void;
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
};

export default function TodoList({ todos, onRemoveTodo, onUpdateTodo }: TodoListProps) {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onRemove={onRemoveTodo}
          onUpdate={onUpdateTodo}
        />
      ))}
    </ul>
  );
}
