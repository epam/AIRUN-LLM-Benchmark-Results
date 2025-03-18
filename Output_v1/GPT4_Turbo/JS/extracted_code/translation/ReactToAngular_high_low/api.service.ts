import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  isName(name: string): Observable<any> {
    // Implement API call
    return this.http.get(`/api/isName/${name}`);
  }

  isEmail(email: string): Observable<any> {
    // Implement API call
    return this.http.get(`/api/isEmail/${email}`);
  }

  signup(name: string, email: string, password: string): Observable<any> {
    // Implement API call
    return this.http.post('/api/signup', { name, email, password });
  }
}