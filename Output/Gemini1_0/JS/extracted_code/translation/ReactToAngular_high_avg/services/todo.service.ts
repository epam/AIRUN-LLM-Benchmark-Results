import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../store/models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly API_URL = 'http://localhost:3000/todos';

  constructor(private http: HttpClient) {}

  addTodo(title: string): Observable<Todo> {
    return this.http.post<Todo>(this.API_URL, { title, completed: false });
  }

  toggleAll(checked: boolean): Observable<Todo[]> {
    return this.http.put<Todo[]>(this.API_URL + '/toggle-all', { completed: checked });
  }

  toggle(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(this.API_URL + '/' + todo.id, { completed: !todo.completed });
  }

  destroy(todo: Todo): Observable<Todo> {
    return this.http.delete<Todo>(this.API_URL + '/' + todo.id);
  }

  edit(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(this.API_URL + '/' + todo.id, todo);
  }

  save(todo: Todo, text: string): Observable<Todo> {
    return this.http.put<Todo>(this.API_URL + '/' + todo.id, { title: text });
  }

  clearCompleted(): Observable<void> {
    return this.http.delete<void>(this.API_URL + '/clear-completed');
  }
}