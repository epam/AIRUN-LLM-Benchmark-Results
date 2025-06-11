import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TodoItem from './TodoItem';
import { RootState, AppDispatch } from '../store';
import { Todo } from '../features/todos/types';
import { editTodo } from '../features/todos/todosSlice';

interface TodoListProps {
  filteredTodos: Todo[];
  editingId: string | null;
  setEditingId: (id: string | null) => void;
}

const TodoList: React.FC<TodoListProps> = ({ filteredTodos, editingId, setEditingId }) => {
  const dispatch: AppDispatch = useDispatch();

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = (id: string, title: string) => {
    dispatch(editTodo({ id, title }));
    setEditingId(null);
  };

  return (
    <ul className="todo-list">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          editing={editingId === todo.id}
          onEdit={() => handleEdit(todo.id)}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      ))}
    </ul>
  );
};

export default TodoList;