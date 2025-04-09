import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo } from '../slices/todosSlice';
import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from '../constants';

const TodoApp = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: any) => state.todos);
  const [newTodo, setNewTodo] = useState('');
  const [nowShowing, setNowShowing] = useState(ALL_TODOS);

  const handleNewTodoKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === ENTER_KEY) {
      e.preventDefault();
      dispatch(addTodo(newTodo));
      setNewTodo('');
    }
  };

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    // todo: implement toggle all
  };

  const filteredTodos = todos.filter((todo: any) => {
    switch (nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleNewTodoKeyDown}
          placeholder="What needs to be done?"
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
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {filteredTodos.map((todo: any) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </section>
      )}
      {todos.length > 0 && (
        <TodoFooter nowShowing={nowShowing} />
      )}
    </div>
  );
};

export default TodoApp;