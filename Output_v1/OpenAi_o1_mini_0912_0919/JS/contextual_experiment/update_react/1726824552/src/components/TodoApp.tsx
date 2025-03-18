```typescript
import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleAll, clearCompleted } from '../store/todosSlice';
import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';
import { ENTER_KEY, ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { RootState } from '../store/store';

const TodoApp: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const [nowShowing, setNowShowing] = useState(ALL_TODOS);
  const [editing, setEditing] = useState<string | null>(null);
  const newFieldRef = useRef<HTMLInputElement>(null);

  const handleNewTodoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode !== ENTER_KEY) return;

    e.preventDefault();

    const input = newFieldRef.current;
    if (input) {
      const val = input.value.trim();
      if (val) {
        dispatch(addTodo(val));
        input.value = '';
      }
    }
  };

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(e.target.checked));
  };

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          ref={newFieldRef}
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus
        />
      </header>
      {todos.length > 0 && (
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
            {todos
              .filter(todo => {
                switch (nowShowing) {
                  case ACTIVE_TODOS:
                    return !todo.completed;
                  case COMPLETED_TODOS:
                    return todo.completed;
                  default:
                    return true;
                }
              })
              .map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
          </ul>
        </section>
      )}
      <TodoFooter />
    </div>
  );
};

export default TodoApp;
```