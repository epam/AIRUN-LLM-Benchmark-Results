import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { TodoFooter } from '../TodoFooter';
import { TodoItem } from '../TodoItem';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from '../../constants';
import { TodoModel } from '../../models/TodoModel';

class TodoApp extends Component {
  state = {
    nowShowing: ALL_TODOS,
    editing: null,
  };

  handleNewTodoKeyDown = (event) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const input = ReactDOM.findDOMNode(this.refs.newField);
    const val = input && input.value.trim();

    if (val) {
      this.props.model.addTodo(val);
      if (input) {
        input.value = '';
      }
    }
  };

  toggleAll = (event) => {
    var target = event.target;
    var checked = target.checked;
    this.props.model.toggleAll(checked);
  };

  toggle = (todoToToggle) => {
    this.props.model.toggle(todoToToggle);
  };

  destroy = (todo) => {
    this.props.model.destroy(todo);
  };

  edit = (todo) => {
    this.setState({ editing: todo.id });
  };

  save = (todoToSave, text) => {
    this.props.model.save(todoToSave, text);
    this.setState({ editing: null });
  };

  cancel = () => {
    this.setState({ editing: null });
  };

  clearCompleted = () => {
    this.props.model.clearCompleted();
  };

  render() {
    var footer;
    var main;
    const { todos } = this.props.model;

    var shownTodos = todos.filter((todo) => {
      switch (this.state.nowShowing) {
        case ACTIVE_TODOS:
          return !todo.completed;
        case COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    }, this);

    var todoItems = shownTodos.map((todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggle={this.toggle}
        onDestroy={this.destroy}
        onEdit={this.edit}
        editing={this.state.editing === todo.id}
        onSave={this.save}
        onCancel={this.cancel}
      />
    ));

    var activeTodoCount = todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    var completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer = (
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.state.nowShowing}
          onClearCompleted={this.clearCompleted}
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
            onChange={this.toggleAll}
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
            onKeyDown={this.handleNewTodoKeyDown}
            autoFocus={true}
          />
        </header>
        {main}
        {footer}
      </div>
    );
  }
}

export default TodoApp;