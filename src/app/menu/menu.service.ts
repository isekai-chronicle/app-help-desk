import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { of } from 'rxjs';

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

  // Get() {
  //   return this.http.get(`${AUTH_API}/api/Menu/Get`);
  // }

  GetMenu(employee_id: any) {
    console.log(employee_id, 'get menu services');
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
    console.log(data, 'post menu services');

    //    return of([]);
    return this.http.post(`${AUTH_API}/api/Menu/PostMenu`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  PostMenuData(data: any) {
    console.log(data, 'post services');

    //    return of([]);

    return this.http.post(`${AUTH_API}/api/Menu/PostMenuData`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  PutMenuData(data: any) {
    console.log(data, 'putMenuData services');

    // return of([]);
    return this.http.put(`${AUTH_API}/api/Menu/PutMenuData`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
    //    return of([]);
  }
  Put(data: any) {
    console.log(data, 'put services');
    // return of([]);

    return this.http.put(`${AUTH_API}/api/Menu/PutMenu`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  PutMenuDataComponent(data: any) {
    console.log(data, 'PutMenuDataComponent services');
    //return of([]);

    return this.http.put(`${AUTH_API}/api/Menu/PutMenuDataComponent`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  PostMenuComponent(data: any) {
    console.log(data, 'PostMenuComponent services');
    //return of([]);

    return this.http.post(`${AUTH_API}/api/Authentication/PostMenu`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });

    ///api/Authentication/PostMenu
  }
}
