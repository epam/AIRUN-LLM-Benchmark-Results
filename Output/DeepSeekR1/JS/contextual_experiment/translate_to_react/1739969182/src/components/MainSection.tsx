import { useState, useRef, useEffect } from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../store/todoSlice';
import useKeyPress from '../hooks/useKeyPress';

type MainSectionProps = {
  todos: Todo[];
  onToggleAll: (completed: boolean) => void;
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
  onRemoveTodo: (id: string) => void;
};

const useFocus = (shouldFocus: boolean) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return ref;
};

export default function MainSection({ todos, onToggleAll, onUpdateTodo, onRemoveTodo }: MainSectionProps) {
  const [editedId, setEditedId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  const handleEdit = (todo: Todo) => {
    setEditedId(todo.id);
    setEditedTitle(todo.title);
  };

  const handleSubmit = (id: string) => {
    const title = editedTitle.trim();
    if (title) {
      onUpdateTodo(id, { title });
    } else {
      onRemoveTodo(id);
    }
    setEditedId(null);
  };

  const handleKeyPress = (id: string) => {
    useKeyPress('Enter', () => handleSubmit(id));
    useKeyPress('Escape', () => {
      setEditedId(null);
      onUpdateTodo(id, { title: editedTitle });
    });
  };

  const allCompleted = todos.every(todo => todo.completed);

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={allCompleted}
        onChange={(e) => onToggleAll(e.target.checked)}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isEditing={editedId === todo.id}
            editedTitle={editedTitle}
            onEdit={handleEdit}
            onUpdate={handleSubmit}
            onRemove={onRemoveTodo}
            onKeyPress={handleKeyPress}
            onTitleChange={setEditedTitle}
          />
        ))}
      </ul>
    </section>
  );
}
