import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = 'http://localhost:5002/api'; // Cambia esta URL a la de tu API

  constructor(private http: HttpClient) {}

  getProject(user_id: string) {
    return this.http.get<any[]>(
      `${this.apiUrl}/Project/Get?user_id=${user_id}`
    );
  }

  getTask(user_id: string, project_id: string) {
    return this.http.get<any[]>(
      `${this.apiUrl}/List/Get?user_id=${user_id}&project_id=${project_id}`
    );
  }
}
