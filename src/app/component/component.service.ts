import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { of } from 'rxjs';

const AUTH_API = environment.apiHelpDeskUrl;

@Injectable({
  providedIn: 'root',
})
export class ComponentService {
  constructor(private http: HttpClient) {}

  GetComboArea() {
    return this.http.get(`${AUTH_API}/api/Area/GetCombo`);
  }

  GetComboPath() {
    return this.http.get(`${AUTH_API}/api/Paths/GetCombo`);
  }

  Get() {
    return this.http.get(`${AUTH_API}/api/Component/Get`);
  }

  Post(data: any) {
    return this.http.post(`${AUTH_API}/api/Component/Post`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  Put(data: any) {
    return this.http.put(`${AUTH_API}/api/Component/Put`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  Delete(data: any) {
    return of([]);
    // return this.http.delete(`${AUTH_API}/api/Component/Delete`, {
    //   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    //   body: data,
    // });
  }
}
