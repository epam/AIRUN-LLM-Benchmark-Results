import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TodoModel } from './todoModel';
import { TodoFooter } from './footer';
import { TodoItem } from './todoItem';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';

interface IAppProps {
  model: TodoModel;
}

interface IAppState {
  nowShowing: string;
  editing: string | null;
}

const TodoApp: React.FC<IAppProps> = ({ model }) => {
  const [state, setState] = React.useState<IAppState>({ nowShowing: ALL_TODOS, editing: null });

  React.useEffect(() => {
    const setStateWrapper = (newState: Partial<IAppState>) => {
      setState(prev => ({ ...prev, ...newState }));
    };
    const router = Router({
      '/': () => setStateWrapper({ nowShowing: ALL_TODOS }),
      '/active': () => setStateWrapper({ nowShowing: ACTIVE_TODOS }),
      '/completed': () => setStateWrapper({ nowShowing: COMPLETED_TODOS })
    });
    router.init('/');
    return () => {
      // cleanup if needed
    };
  }, []);

  const handleNewTodoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode !== ENTER_KEY) return;
    e.preventDefault();
    const input = e.currentTarget;
    const val = input.value.trim();
    if (val) {
      model.addTodo(val);
      input.value = '';
    }
  };

  const toggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    model.toggleAll(checked);
  };

  const toggle = (todo: ITodo) => {
    model.toggle(todo);
  };

  const destroy = (todo: ITodo) => {
    model.destroy(todo);
  };

  const edit = (todo: ITodo) => {
    setState(prev => ({ ...prev, editing: todo.id }));
  };

  const save = (todo: ITodo, text: string) => {
    model.save(todo, text);
    setState(prev => ({ ...prev, editing: null }));
  };

  const cancel = () => {
    setState(prev => ({ ...prev, editing: null }));
  };

  const clearCompleted = () => {
    model.clearCompleted();
  };

  const todos = model.todos;
  const { nowShowing, editing } = state;

  const shownTodos = todos.filter(todo => {
    switch (nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const todoItems = shownTodos.map(todo => (
    <TodoItem
      key={todo.id}
      todo={todo}
      onToggle={() => toggle(todo)}
      onDestroy={() => destroy(todo)}
      onEdit={() => edit(todo)}
      onSave={(text) => save(todo, text)}
      onCancel={cancel}
      editing={editing === todo.id}
    />
  ));

  const activeTodoCount = todos.reduce((acc, todo) => (todo.completed ? acc : acc + 1), 0);
  const completedCount = todos.length - activeTodoCount;

  const footer = (activeTodoCount || completedCount) ? (
    <TodoFooter
      count={activeTodoCount}
      completedCount={completedCount}
      nowShowing={nowShowing}
      onClearCompleted={clearCompleted}
    />
  ) : null;

  const main = todos.length ? (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={toggleAll}
        checked={activeTodoCount === 0}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">{todoItems}</ul>
    </section>
  ) : null;

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
      {main}
      {footer}
    </div>
  );
};

const model = new TodoModel('react-todos');

const render = () => {
  ReactDOM.render(<TodoApp model={model} />, document.getElementsByClassName('todoapp')[0]);
};

model.subscribe(render);
render();
