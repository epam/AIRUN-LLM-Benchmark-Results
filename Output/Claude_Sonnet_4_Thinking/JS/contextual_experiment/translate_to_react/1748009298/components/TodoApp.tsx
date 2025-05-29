import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { toggleAll } from '../store/todoSlice';
import { TodoHeader } from './TodoHeader';
import { TodoItem } from './TodoItem';
import { TodoFooter } from './TodoFooter';

type FilterType = 'all' | 'active' | 'completed';

export const TodoApp: React.FC = () => {
  const dispatch = useDispatch();
  const { todos, filter } = useSelector((state: RootState) => state.todos);
  
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const remainingCount = todos.filter(todo => !todo.completed).length;
  const allChecked = remainingCount === 0 && todos.length > 0;

  const handleToggleAll = () => {
    dispatch(toggleAll(!allChecked));
  };

  return (
    <div>
      <section className="todoapp">
        <TodoHeader />
        {todos.length > 0 && (
          <section className="main">
            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              checked={allChecked}
              onChange={handleToggleAll}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
              {filteredTodos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>
          </section>
        )}
        {todos.length > 0 && (
          <TodoFooter currentFilter={filter} />
        )}
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Credits:
          <a href="http://twitter.com/cburgdorf">Christoph Burgdorf</a>,
          <a href="http://ericbidelman.com">Eric Bidelman</a>,
          <a href="http://jacobmumm.com">Jacob Mumm</a>,
          <a href="http://blog.igorminar.com">Igor Minar</a> and
          <a href="http://twitter.com/passy">Pascal Hartig</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </div>
  );
};