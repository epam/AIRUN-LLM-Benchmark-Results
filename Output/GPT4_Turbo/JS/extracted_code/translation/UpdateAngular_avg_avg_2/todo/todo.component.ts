import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo.model';
import { AppState } from '../store/app.state';
import * as TodoActions from '../store/todo.actions';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todos$: Observable<Todo[]>;
  newTodo: string = '';

  constructor(private store: Store<AppState>) {
    this.todos$ = store.select('todos');
  }

  ngOnInit(): void {
  }

  addTodo(): void {
    if (this.newTodo.trim().length) {
      this.store.dispatch(TodoActions.addTodo({ title: this.newTodo }));
      this.newTodo = '';
    }
  }

  toggleCompletion(todo: Todo): void {
    this.store.dispatch(TodoActions.toggleTodo({ id: todo.id }));
  }

  deleteTodo(todo: Todo): void {
    this.store.dispatch(TodoActions.deleteTodo({ id: todo.id }));
  }
}