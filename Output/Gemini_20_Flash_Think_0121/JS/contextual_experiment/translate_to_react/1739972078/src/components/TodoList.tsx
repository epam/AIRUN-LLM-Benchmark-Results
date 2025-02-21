import React from 'react';
import { useSelector } from 'react-redux';
import TodoItem from './TodoItem';
import { selectFilteredTodos } from '../features/todos/selectors';
import { Filter } from '../components/TodoApp';

interface TodoListProps {
  filter: Filter;
}

const TodoList: React.FC<TodoListProps> = ({ filter }) => {
  const todos = useSelector(state => selectFilteredTodos(state, filter));

  return (
    <section className="main">
      <input 
        id="toggle-all" 
        className="toggle-all" 
        type="checkbox"
        // Implementation for toggle all will be added in TodoApp component
        // checked={isAllChecked} 
        // onChange={handleMarkAllComplete}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
