import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  addTodo,
  clearCompleted,
  destroy,
  edit,
  save,
  toggle,
  toggleAll,
} from './store/actions/todo.actions';
import { Todo } from './store/models/todo.model';
import { selectTodos } from './store/selectors/todo.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  todos$: Observable<Todo[]>;
  activeTodoCount: number;
  completedCount: number;
  nowShowing: string;
  ALL_TODOS = 'all';
  ACTIVE_TODOS = 'active';
  COMPLETED_TODOS = 'completed';

  constructor(private store: Store) {
    this.todos$ = this.store.select(selectTodos);
  }

  ngOnInit(): void {
    this.todos$.subscribe((todos) => {
      this.activeTodoCount = todos.filter((todo) => !todo.completed).length;
      this.completedCount = todos.filter((todo) => todo.completed).length;
    });
  }

  handleNewTodoKeyDown(event: KeyboardEvent): void {
    if (event.keyCode !== 13) {
      return;
    }

    event.preventDefault();

    const val = (document.getElementById('newField') as HTMLInputElement).value.trim();

    if (val) {
      this.store.dispatch(addTodo({ title: val }));
      (document.getElementById('newField') as HTMLInputElement).value = '';
    }
  }

  toggleAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    this.store.dispatch(toggleAll({ checked }));
  }

  toggle(todo: Todo): void {
    this.store.dispatch(toggle({ todo }));
  }

  destroy(todo: Todo): void {
    this.store.dispatch(destroy({ todo }));
  }

  edit(todo: Todo): void {
    this.store.dispatch(edit({ todo }));
  }

  save(todo: Todo, text: string): void {
    this.store.dispatch(save({ todo, text }));
  }

  cancel(): void {
    this.store.dispatch(edit({ todo: null }));
  }

  clearCompleted(): void {
    this.store.dispatch(clearCompleted());
  }
}