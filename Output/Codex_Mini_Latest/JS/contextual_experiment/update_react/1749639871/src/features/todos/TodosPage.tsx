import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
import { TodoFooter } from './TodoFooter';
import { addTodo, toggleAll, toggleTodo, deleteTodo, editTodo, saveTodo, cancelEdit, clearCompleted, setFilter } from './todosSlice';
import { Filter } from './types';
import { RootState } from '../../app/store';

export const TodosPage: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);
  const editingId = useSelector((state: RootState) => state.todos.editingId);
  const params = useParams<{ filter?: string }>();

  useEffect(() => {
    const filterParam = params.filter === 'active' || params.filter === 'completed' ? params.filter as Filter : 'all';
    dispatch(setFilter(filterParam));
  }, [params.filter, dispatch]);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const activeCount = todos.reduce((count, todo) => (!todo.completed ? count + 1 : count), 0);
  const completedCount = todos.length - activeCount;

  return (
    <>
      <header className="header">
        <h1>todos</h1>
        <TodoInput onAdd={title => dispatch(addTodo(title))} />
      </header>
      <TodoList
        todos={filteredTodos}
        editingId={editingId}
        onToggleAll={checked => dispatch(toggleAll(checked))}
        onToggle={id => dispatch(toggleTodo(id))}
        onDestroy={id => dispatch(deleteTodo(id))}
        onEdit={id => dispatch(editTodo(id))}
        onSave={(id, text) => dispatch(saveTodo({ id, text }))}
        onCancel={() => dispatch(cancelEdit())}
      />
      <TodoFooter
        count={activeCount}
        completedCount={completedCount}
        filter={filter}
        onClearCompleted={() => dispatch(clearCompleted())}
      />
    </>
  );
};