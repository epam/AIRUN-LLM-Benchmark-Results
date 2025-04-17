import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleTodo, removeTodo, editTodoStart, editTodoDone, editTodoCancel } from '../store/todosSlice';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);
  const editedTodoId = useSelector((state: RootState) => state.todos.editedTodoId);

  const filteredTodos = React.useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const onToggle = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const onRemove = (id: string) => {
    dispatch(removeTodo(id));
  };

  const onEditStart = (id: string) => {
    dispatch(editTodoStart(id));
  };

  const onEditCancel = () => {
    dispatch(editTodoCancel());
  };

  const onEditDone = (id: string, title: string) => {
    dispatch(editTodoDone({ id, title }));
  };

  if (filteredTodos.length === 0) return null;

  return (
    <section className="main">
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            editing={editedTodoId === todo.id}
            onToggle={() => onToggle(todo.id)}
            onRemove={() => onRemove(todo.id)}
            onEditStart={() => onEditStart(todo.id)}
            onEditCancel={onEditCancel}
            onEditDone={onEditDone}
          />
        ))}
      </ul>
    </section>
  );
};
