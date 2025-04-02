import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleAll } from '../store/todosSlice';
import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';
import { RootState } from '../store';
import { FilterType, ENTER_KEY } from '../constants';

const TodoApp: React.FC = () => {
  const [nowShowing, setNowShowing] = useState<FilterType>(FilterType.All);
  const [editingId, setEditingId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos);
  const newFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const route = window.location.hash.replace('#/', '');
      switch (route) {
        case '':
          setNowShowing(FilterType.All);
          break;
        case 'active':
          setNowShowing(FilterType.Active);
          break;
        case 'completed':
          setNowShowing(FilterType.Completed);
          break;
        default:
          setNowShowing(FilterType.All);
          break;
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNewTodoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const input = newFieldRef.current;
    if (input) {
      const val = input.value.trim();
      if (val) {
        dispatch(addTodo(val));
        input.value = '';
      }
    }
  };

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(event.target.checked));
  };

  const handleEdit = (id: string | null) => {
    setEditingId(id);
  };

  const activeTodoCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;

  const shownTodos = todos.filter((todo) => {
    switch (nowShowing) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <div>
      <header className=\"header\">
        <h1>todos</h1>
        <input
          ref={newFieldRef}
          className=\"new-todo\"
          placeholder=\"What needs to be done?\"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus={true}
        />
      </header>
      {todos.length > 0 && (
        <section className=\"main\">
          <input
            id=\"toggle-all\"
            className=\"toggle-all\"
            type=\"checkbox\"
            onChange={handleToggleAll}
            checked={activeTodoCount === 0}
          />
          <label htmlFor=\"toggle-all\">Mark all as complete</label>
          <ul className=\"todo-list\">
            {shownTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                editing={editingId === todo.id}
                onEdit={handleEdit}
                onCancel={() => handleEdit(null)}
              />
            ))}
          </ul>
        </section>
      )}
      {(activeTodoCount > 0 || completedCount > 0) && (
        <TodoFooter filter={nowShowing} />
      )}
    </div>
  );
};

export default TodoApp;
