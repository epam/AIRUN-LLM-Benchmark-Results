import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { addTodo, toggleAll, clearCompleted } from './todosSlice';
import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';
import { ENTER_KEY } from '../../constants';

const TodoApp: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch();

  const handleNewTodoKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const val = input.value.trim();

    if (val) {
      dispatch(addTodo(val));
      input.value = '';
    }
  };

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(event.target.checked));
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus
        />
      </header>
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={handleToggleAll}
          checked={todos.every(todo => todo.completed)}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </section>
      <TodoFooter
        count={todos.filter(todo => !todo.completed).length}
        completedCount={todos.filter(todo => todo.completed).length}
        onClearCompleted={handleClearCompleted}
      />
    </div>
  );
};

export default TodoApp;