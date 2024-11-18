import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TodoItem } from './components/TodoItem';
import { TodoFooter } from './components/TodoFooter';
import { addTodo, toggleTodo, destroyTodo, clearCompleted, toggleAll } from './store/todoSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';

const App: React.FC = () => {
  const todos = useSelector((state: any) => state.todos.todos);
  const dispatch = useDispatch();
  const [nowShowing, setNowShowing] = React.useState(ALL_TODOS);
  const [editing, setEditing] = React.useState<string | null>(null);

  const handleNewTodoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) return;
    event.preventDefault();
    const input = event.currentTarget;
    const val = input.value.trim();
    if (val) {
      dispatch(addTodo(val));
      input.value = '';
    }
  };

  const toggleAllTodos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    dispatch(toggleAll(checked));
  };

  const handleToggle = (todoId: string) => {
    dispatch(toggleTodo(todoId));
  };

  const handleDestroy = (todoId: string) => {
    dispatch(destroyTodo(todoId));
  };

  const handleEdit = (todoId: string) => {
    setEditing(todoId);
  };

  const handleSave = (todoId: string, text: string) => {
    dispatch(saveTodo({ id: todoId, title: text }));
    setEditing(null);
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const filteredTodos = todos.filter(todo => {
    switch (nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;

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
          onChange={toggleAllTodos}
          checked={activeTodoCount === 0}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => handleToggle(todo.id)}
              onDestroy={() => handleDestroy(todo.id)}
              onEdit={() => handleEdit(todo.id)}
              editing={editing === todo.id}
              onSave={(text) => handleSave(todo.id, text)}
              onCancel={handleCancel}
            />
          ))}
        </ul>
      </section>
      <TodoFooter
        count={activeTodoCount}
        completedCount={completedCount}
        nowShowing={nowShowing}
        onClearCompleted={handleClearCompleted}
      />
    </div>
  );
};

export default App;