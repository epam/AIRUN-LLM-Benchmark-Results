import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { TodoFilter, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { toggleTodo, toggleAllTodos, removeTodo, editTodo } from '../redux/todosSlice';
import TodoItem from './TodoItem';

interface MainSectionProps {
  nowShowing: TodoFilter;
}

const MainSection: React.FC<MainSectionProps> = ({ nowShowing }) => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch();

  const [editingId, setEditingId] = useState<string | null>(null);

  const shownTodos = todos.filter((todo) => {
    switch (nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodoCount = todos.reduce((count, todo) => (todo.completed ? count : count + 1), 0);
  const completedCount = todos.length - activeTodoCount;

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAllTodos(event.target.checked));
  };

  const handleToggle = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const handleDestroy = (id: string) => {
    dispatch(removeTodo(id));
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string, title: string) => {
    dispatch(editTodo({ id, title }));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
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
        onChange={handleToggleAll}
        checked={activeTodoCount === 0 && todos.length > 0}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {shownTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDestroy={handleDestroy}
            onEdit={handleEdit}
            editing={editingId === todo.id}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ))}
      </ul>
    </section>
  );
};

export default MainSection;
