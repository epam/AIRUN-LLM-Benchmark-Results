import React from "react";
import ReactDOM from "react-dom";
import { TodoModel } from "./todoModel";
import { TodoFooter } from "./footer";
import { TodoItem } from "./todoItem";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from "./constants";

const TodoApp = (props) => {
  const [state, setState] = React.useState({
    nowShowing: ALL_TODOS,
    editing: null,
  });

  React.useEffect(() => {
    const router = Router({
      "/": () => setState({ nowShowing: ALL_TODOS }),
      "/active": () => setState({ nowShowing: ACTIVE_TODOS }),
      "/completed": () => setState({ nowShowing: COMPLETED_TODOS }),
    });
    router.init("/");
  }, []);

  const handleNewTodoKeyDown = (event) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = (ReactDOM.findDOMNode(props.refs["newField"]) as HTMLInputElement).value.trim();

    if (val) {
      props.model.addTodo(val);
      (ReactDOM.findDOMNode(props.refs["newField"]) as HTMLInputElement).value = "";
    }
  };

  const toggleAll = (event) => {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    props.model.toggleAll(checked);
  };

  const toggle = (todoToToggle) => {
    props.model.toggle(todoToToggle);
  };

  const destroy = (todo) => {
    props.model.destroy(todo);
  };

  const edit = (todo) => {
    setState({ editing: todo.id });
  };

  const save = (todoToSave, text) => {
    props.model.save(todoToSave, text);
    setState({ editing: null });
  };

  const cancel = () => {
    setState({ editing: null });
  };

  const clearCompleted = () => {
    props.model.clearCompleted();
  };

  const todos = props.model.todos;

  const shownTodos = todos.filter((todo) => {
    switch (state.nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const todoItems = shownTodos.map((todo) => {
    return (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggle={() => toggle(todo)}
        onDestroy={() => destroy(todo)}
        onEdit={() => edit(todo)}
        editing={state.editing === todo.id}
        onSave={(text) => save(todo, text)}
        onCancel={() => cancel()}
      />
    );
  });

  let footer;
  let main;
  const activeTodoCount = todos.reduce((accum, todo) => {
    return todo.completed ? accum : accum + 1;
  }, 0);

  const completedCount = todos.length - activeTodoCount;

  if (activeTodoCount || completedCount) {
    footer = (
      <TodoFooter
        count={activeTodoCount}
        completedCount={completedCount}
        nowShowing={state.nowShowing}
        onClearCompleted={clearCompleted}
      />
    );
  }

  if (todos.length) {
    main = (
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
    );
  }

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          ref="newField"
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus={true}
        />
      </header>
      {main}
      {footer}
    </div>
  );
};

const model = new TodoModel("react-todos");

const render = () => {
  ReactDOM.render(<TodoApp model={model} />, document.getElementsByClassName("todoapp")[0]);
};

model.subscribe(render);
render();