import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Todo } from '../types';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos);
  const filter = useSelector((state: RootState) => state.filter);
  const [editedTodoId, setEditedTodoId] = useState<string | null>(null);

  const filteredTodos = todos.filter((todo: Todo) => {
    if (filter === 'active') {
      return !todo.completed;
    } else if (filter === 'completed') {
      return todo.completed;
    }
    return true;
  });

  return (
    <ul className="todo-list">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={editedTodoId === todo.id}
          setEditedTodoId={setEditedTodoId}
        />
      ))}
    </ul>
  );
};

export default TodoList;
