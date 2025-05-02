import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

const AUTH_API = environment.apiHelpDeskUrl;

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private http: HttpClient) {}

  GetRoleCombo() {
    return this.http.get(`${AUTH_API}/api/Role/GetCombo`);
  }

  GetComboUser() {
    return this.http.get(`${AUTH_API}/api/User/GetCombo`);
  }

  GetMenu(employee_id: any) {
    return this.http.get(`${AUTH_API}/api/Menu/Get?user_id=${employee_id}`);
  }

  GetMenuData() {
    return this.http.get(`${AUTH_API}/api/MenuData/Get`);
  }

  GetMenuComponent(menuData_id: any) {
    return this.http.get(
      `${AUTH_API}/api/Menu/GetMenuComponent?menuData_id=${menuData_id}`
    );
  }

  GetComboMenuData(menu_id: any) {
    return this.http.get(
      `${AUTH_API}/api/Menu/GetComboMenuData?menu_id=${menu_id}`
    );
  }

  PostMenu(data: any) {
    return this.http.post(`${AUTH_API}/api/Menu/PostMenu`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  PostMenuData(data: any) {
    return this.http.post(`${AUTH_API}/api/Menu/PostMenuData`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  PutMenuData(data: any) {
    return this.http.put(`${AUTH_API}/api/Menu/PutMenuData`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
  Put(data: any) {
    return this.http.put(`${AUTH_API}/api/Menu/PutMenu`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  PutMenuDataComponent(data: any) {
    return this.http.put(`${AUTH_API}/api/Menu/PutMenuDataComponent`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  PostMenuComponent(data: any) {
    return this.http.post(`${AUTH_API}/api/Authentication/PostMenu`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
}
