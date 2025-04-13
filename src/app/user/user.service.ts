import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { of } from 'rxjs';

const AUTH_API = environment.apiHelpDeskUrl;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  GetComboArea() {
    return this.http.get(`${AUTH_API}/api/Area/GetCombo`);
  }

  GetComboDomain() {
    return this.http.get(`${AUTH_API}/api/Domain/GetCombo`);
  }

  Get() {
    return this.http.get(`${AUTH_API}/api/User/Get`);
  }

  Post(data: string) {
    return this.http.post(`${AUTH_API}/api/User/Post`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  PostPassword(data: any) {
    return this.http.put(`${AUTH_API}/api/User/PutPassword`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  Put(data: any) {
    return this.http.put(`${AUTH_API}/api/User/Put`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  Delete(data: any) {
    // return this.http.delete(`${AUTH_API}/api/User/Delete`, {
    //   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    //   body: data,
    // });
    return of([]);
  }
}
