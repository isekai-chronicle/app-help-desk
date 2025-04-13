import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { of } from 'rxjs';

const AUTH_API = environment.apiHelpDeskUrl;

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}

  GetComboArea() {
    return this.http.get(`${AUTH_API}/api/Area/GetCombo`);
  }

  Get() {
    return this.http.get(`${AUTH_API}/api/Role/Get`);
  }

  Post(data: string) {
    return this.http.post(`${AUTH_API}/api/Role/Post`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  Put(data: any) {
    return this.http.put(`${AUTH_API}/api/Role/Put`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  Delete(data: any) {
    return this.http.delete(`${AUTH_API}/api/Role/Delete`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: data,
    });
  }
}
