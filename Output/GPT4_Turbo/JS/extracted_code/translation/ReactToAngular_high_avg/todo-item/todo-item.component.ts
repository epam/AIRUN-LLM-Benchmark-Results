import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../todo.model';
import { Store } from '@ngrx/store';
import { toggleTodo, destroyTodo, editTodo } from '../store/todos.actions';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent {
  @Input() todo: Todo;
  editing: boolean = false;
  editText: string = '';

  constructor(private store: Store) {}

  toggleTodo() {
    this.store.dispatch(toggleTodo({ id: this.todo.id }));
  }

  destroyTodo() {
    this.store.dispatch(destroyTodo({ id: this.todo.id }));
  }

  editTodo() {
    this.editing = true;
    this.editText = this.todo.title;
  }

  saveTodo() {
    if (this.editText.trim().length) {
      this.store.dispatch(editTodo({ id: this.todo.id, title: this.editText.trim() }));
      this.editing = false;
    }
  }

  cancelEdit() {
    this.editing = false;
  }
}