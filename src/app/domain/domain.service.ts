import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { of } from 'rxjs';

const AUTH_API = environment.apiHelpDeskUrl;

@Injectable({
  providedIn: 'root',
})
export class DomainService {
  constructor(private http: HttpClient) {}

  Get() {
    return this.http.get(`${AUTH_API}/api/Domain/Get`);
  }

  Post(data: any) {
    return this.http.post(`${AUTH_API}/api/Domain/Post`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  Put(data: any) {
    return this.http.put(`${AUTH_API}/api/Domain/Put`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  Delete(data: any) {
    return this.http.delete(`${AUTH_API}/api/Domain/Delete`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: data,
    });
  }
}
