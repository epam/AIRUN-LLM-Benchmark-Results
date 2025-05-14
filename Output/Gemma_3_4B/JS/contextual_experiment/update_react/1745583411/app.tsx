import React, { useState } from 'react';
import { TodoModel } from './todoModel';
import { TodoFooter } from './footer';
import { TodoItem } from './todoItem';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';
import { uuid } from './utils';

type IAppProps = {
  model: TodoModel;
};

type IAppState = {
  nowShowing: string;
  editing: string | null;
};

const TodoApp: React.FC<IAppProps> = ({ model }) => {
  const [nowShowing, setNowShowing] = useState<string>(ALL_TODOS);
  const [editing, setEditing] = useState<string | null>(null);

  const handleNewTodoKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode !== 13) { // Enter
      return;
    }

    event.preventDefault();

    const value = (document.querySelector('#new-todo') as HTMLInputElement)?.value.trim();

    if (value) {
      model.addTodo(value);
      (document.querySelector('#new-todo') as HTMLInputElement)?.value = '';
    }
  };

  const toggleAll = (event: React.FormEvent) => {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    model.toggleAll(checked);
  };

  const toggle = (todo: ITodo) => {
    model.toggle(todo);
  };

  const destroy = (todo: ITodo) => {
    model.destroy(todo);
  };

  const edit = (todo: ITodo) => {
    setEditing(todo.id);
  };

  const save = (todo: ITodo, text: string) => {
    model.save(todo, text);
    setEditing(null);
  };

  const cancel = () => {
    setEditing(null);
  };

  const clearCompleted = () => {
    model.clearCompleted();
  };

  const todos = model.todos;

  const shownTodos = todos.filter((todo) => {
    switch (nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const todoItems = shownTodos.map((todo) => (
    <TodoItem
      key={todo.id}
      todo={todo}
      onToggle={toggle}
      onDestroy={destroy}
      onEdit={edit}
      editing={editing === todo.id}
      onSave={save}
      onCancel={cancel}
    />
  ));

  const activeTodoCount = todos.reduce((accum, todo) => (todo.completed ? accum : accum + 1), 0);
  const completedCount = todos.length - activeTodoCount;

  return (
    <div className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          id="new-todo"
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus={true}
        />
      </header>
      <section className="main">
        <input
          type="checkbox"
          id="toggle-all"
          className="toggle-all"
          onChange={toggleAll}
          checked={activeTodoCount === 0}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {todoItems}
        </ul>
      </section>
      <TodoFooter
        count={activeTodoCount}
        completedCount={completedCount}
        nowShowing={nowShowing}
        onClearCompleted={clearCompleted}
      />
    </div>
  );
};

const model = new TodoModel('react-todos');

export default TodoApp;