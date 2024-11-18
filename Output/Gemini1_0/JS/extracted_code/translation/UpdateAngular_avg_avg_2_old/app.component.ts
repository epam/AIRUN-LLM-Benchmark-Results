import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  addTodo,
  clearDoneTodos,
  deleteTodo,
  editTodo,
  markAll,
  toggleTodo,
} from './store/actions/todo.actions';
import { Todo } from './store/models/todo.model';
import { selectTodos, selectStatusFilter } from './store/selectors/todo.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  todos$: Observable<Todo[]>;
  statusFilter$: Observable<string>;
  newTodo = '';
  editedTodo: Todo | null = null;
  remainingCount: number = 0;
  allChecked: boolean = false;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.todos$ = this.store.select(selectTodos);
    this.statusFilter$ = this.store.select(selectStatusFilter);
  }

  trackByFn(index: number, todo: Todo): number {
    return todo.id;
  }

  addTodo(): void {
    if (this.newTodo.trim().length === 0) {
      return;
    }
    this.store.dispatch(addTodo({ title: this.newTodo }));
    this.newTodo = '';
  }

  editTodo(todo: Todo): void {
    this.editedTodo = todo;
  }

  doneEditing(todo: Todo): void {
    this.editedTodo = null;
    todo.title = todo.title.trim();
    if (todo.title.length === 0) {
      this.removeTodo(todo);
    } else {
      this.store.dispatch(editTodo({ todo }));
    }
  }

  revertEditing(todo: Todo): void {
    this.store.dispatch(editTodo({ todo: this.editedTodo }));
    this.doneEditing(todo);
  }

  removeTodo(todo: Todo): void {
    this.store.dispatch(deleteTodo({ id: todo.id }));
  }

  toggleTodo(todo: Todo): void {
    this.store.dispatch(toggleTodo({ id: todo.id }));
  }

  markAll(checked: boolean): void {
    this.store.dispatch(markAll({ checked }));
  }

  clearDoneTodos(): void {
    this.store.dispatch(clearDoneTodos());
  }
}