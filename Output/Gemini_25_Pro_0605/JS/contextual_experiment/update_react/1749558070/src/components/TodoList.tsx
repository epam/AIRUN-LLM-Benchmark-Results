import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import TodoItem from './TodoItem';
import { RootState } from '../store/store';
import { toggleAll } from '../store/todosSlice';
import { ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

const TodoList: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos);
  const location = useLocation();
  const [editingId, setEditingId] = useState<string | null>(null);

  const activeTodoCount = todos.reduce((count, todo) => (todo.completed ? count : count + 1), 0);

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(event.target.checked));
  };

  const filteredTodos = todos.filter(todo => {
    switch (location.pathname) {
      case '/active':
        return !todo.completed;
      case '/completed':
        return todo.completed;
      default:
        return true;
    }
  });

  if (todos.length === 0) {
    return null;
  }

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={handleToggleAll}
        checked={activeTodoCount === 0}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isEditing={editingId === todo.id}
            onStartEdit={() => setEditingId(todo.id)}
            onEndEdit={() => setEditingId(null)}
          />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
