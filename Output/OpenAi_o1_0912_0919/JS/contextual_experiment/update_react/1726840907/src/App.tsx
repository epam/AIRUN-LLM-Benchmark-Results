import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from './store';
import { addTodo, toggleAll } from './store/todosSlice';
import TodoFooter from './components/TodoFooter';
import TodoItem from './components/TodoItem';
import { TodoFilters, ENTER_KEY } from './constants';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos);
  const [nowShowing, setNowShowing] = useState<TodoFilters>(TodoFilters.All);
  const [newTodo, setNewTodo] = useState('');

  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/active':
        setNowShowing(TodoFilters.Active);
        break;
      case '/completed':
        setNowShowing(TodoFilters.Completed);
        break;
      default:
        setNowShowing(TodoFilters.All);
        break;
    }
  }, [location.pathname]);

  const handleNewTodoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();
    const val = newTodo.trim();
    if (val) {
      dispatch(addTodo(val));
      setNewTodo('');
    }
  };

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(event.target.checked));
  };

  const activeTodoCount = todos.reduce((accum, todo) => (todo.completed ? accum : accum + 1), 0);
  const completedCount = todos.length - activeTodoCount;

  const shownTodos = todos.filter((todo) => {
    switch (nowShowing) {
      case TodoFilters.Active:
        return !todo.completed;
      case TodoFilters.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const todoItems = shownTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />);

  let main = null;
  if (todos.length > 0) {
    main = (
      <section className=\"main\">
        <input
          id=\"toggle-all\"
          className=\"toggle-all\"
          type=\"checkbox\"
          onChange={handleToggleAll}
          checked={activeTodoCount === 0}
        />
        <label htmlFor=\"toggle-all\">Mark all as complete</label>
        <ul className=\"todo-list\">{todoItems}</ul>
      </section>
    );
  }

  let footer = null;
  if (activeTodoCount > 0 || completedCount > 0) {
    footer = <TodoFooter />;
  }

  return (
    <div className=\"todoapp\">
      <header className=\"header\">
        <h1>todos</h1>
        <input
          className=\"new-todo\"
          placeholder=\"What needs to be done?\"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleNewTodoKeyDown}
          autoFocus
        />
      </header>
      {main}
      {footer}
    </div>
  );
};

export default App;