```typescript
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TodoItem } from './TodoItem';
import { toggleTodo, removeTodo, editTodo, setEditingId } from './todoSlice';
import { ITodo } from '../../types';
import { RootState } from '../../store';

interface TodoListProps {
  todos: ITodo[];
}

export const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  const dispatch = useDispatch();
  const editingId = useSelector((state: RootState) => state.todos.editingId);

  const handleToggle = (todoId: string) => {
    dispatch(toggleTodo(todoId));
  };

  const handleDestroy = (todoId: string) => {
    dispatch(removeTodo(todoId));
  };

  const handleEdit = (todoId: string) => {
    dispatch(setEditingId(todoId));
  };

  const handleSave = (todoId: string, newTitle: string) => {
    dispatch(editTodo({ id: todoId, title: newTitle }));
    dispatch(setEditingId(null)); // Clear editing state after save
  };

  const handleCancel = () => {
    dispatch(setEditingId(null)); // Clear editing state on cancel
  };

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => handleToggle(todo.id)}
          onDestroy={() => handleDestroy(todo.id)}
          onEdit={() => handleEdit(todo.id)}
          editing={editingId === todo.id}
          onSave={(text) => handleSave(todo.id, text)}
          onCancel={handleCancel}
        />
      ))}
    </ul>
  );
};
```