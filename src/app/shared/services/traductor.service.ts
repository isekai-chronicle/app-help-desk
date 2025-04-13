import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';

const AUTH_API = environment.apiHelpDeskUrl;

import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TraductorService {
  constructor(private http: HttpClient) {}

  Post(data: any) {
    return this.http.post(
      `${AUTH_API}/api/Dictionary/PostComponentById`,
      data,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }

  //NOMBRE DEL COMPONENTE  Y EL COMPONEN LANGUAGE Y EL AREA
}
