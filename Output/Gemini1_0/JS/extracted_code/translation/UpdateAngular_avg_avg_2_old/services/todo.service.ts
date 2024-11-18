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

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.API_URL);
  }

  addTodo(title: string): Observable<Todo> {
    return this.http.post<Todo>(this.API_URL, { title, completed: false });
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  editTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.API_URL}/${todo.id}`, todo);
  }

  toggleTodo(id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${this.API_URL}/${id}`, { completed: !this.http.get<Todo>(`${this.API_URL}/${id}`).subscribe((todo) => todo.completed) });
  }

  markAll(checked: boolean): Observable<Todo[]> {
    return this.http.patch<Todo[]>(this.API_URL, { completed: checked });
  }

  clearDoneTodos(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/completed`);
  }
}