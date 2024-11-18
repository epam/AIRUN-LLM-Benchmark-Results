import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo, clearCompleted, toggleAll } from './store/todos.actions';
import { Todo } from './todo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  newTodoTitle: string = '';
  nowShowing: string = 'all';

  constructor(private store: Store<{ todos: Todo[] }>) {}

  addTodo() {
    if (this.newTodoTitle.trim().length) {
      this.store.dispatch(addTodo({ title: this.newTodoTitle.trim() }));
      this.newTodoTitle = '';
    }
  }

  toggleAllTodos(event: any) {
    this.store.dispatch(toggleAll({ completed: event.target.checked }));
  }

  clearCompletedTodos() {
    this.store.dispatch(clearCompleted());
  }

  updateNowShowing(showing: string) {
    this.nowShowing = showing;
  }
}