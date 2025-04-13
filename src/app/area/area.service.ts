import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { of } from 'rxjs';

const AUTH_API = environment.apiHelpDeskUrl;

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  constructor(private http: HttpClient) {}

  Get() {
    return this.http.get(`${AUTH_API}/api/Area/Get`);
  }

  Post(data: any) {
    return this.http.post(`${AUTH_API}/api/Area/Post`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  Put(data: any) {
    return this.http.put(`${AUTH_API}/api/Area/Put`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  Delete(data: any) {
    return this.http.delete(`${AUTH_API}/api/Area/Delete`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: data,
    });
  }
}
