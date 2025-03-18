import React, { useState } from 'react';
import TodoHeader from './TodoHeader';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAllTodosChecked, selectTodos, markAllComplete } from '../features/todos/todosSlice';
import { useLocation } from 'react-router-dom';

export type Filter = 'all' | 'active' | 'completed';

// Custom hook to get current filter from URL hash
const useFilterFromHash = (): Filter => {
  const location = useLocation();
  const hash = location.hash;
  if (hash === '#/active') {
    return 'active';
  } else if (hash === '#/completed') {
    return 'completed';
  } else {
    return 'all';
  }
};


// Selector to filter todos based on current filter
export const selectFilteredTodos = (state: any, filter: Filter) => {
  const todos = selectTodos(state);
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};


const TodoApp: React.FC = () => {
  const filter = useFilterFromHash();
  const isAllChecked = useSelector(selectIsAllTodosChecked);
  const dispatch = useDispatch();

  const handleMarkAllComplete = () => {
    dispatch(markAllComplete(!isAllChecked));
  };


  return (
    <div>
      <section className="todoapp">
        <TodoHeader />
        <TodoList filter={filter} />
        <TodoFooter />
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>Created by <a href="https://twitter.com/cburgdorf">Christoph Burgdorf</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    </div>
  );
};

export default TodoApp;
