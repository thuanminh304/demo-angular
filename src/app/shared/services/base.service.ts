import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUserModel } from '../../modules/admin/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  BASE_URL = 'https://623aba41b5292b8bfcb8db9d.mockapi.io';
  URL_COMPANY_GROUP = 'https://623acd76f8827fbe47a8bc94.mockapi.io';

  constructor(protected _http: HttpClient) {}

  get<T>(endpoint: string) {
    return this._http.get<T>(`${this.BASE_URL}/${endpoint}`);
  }
  getCG<T>(endpoint: string) {
    return this._http.get<T>(`${this.URL_COMPANY_GROUP}/${endpoint}`);
  }
  post(endpoint: string, formUser: IUserModel) {
    return this._http.post(`${this.BASE_URL}/${endpoint}`, formUser);
  }

  put(endpoint: string, formUser: IUserModel) {
    return this._http.put(`${this.BASE_URL}/${endpoint}`, formUser);
  }

  delete<T>(endpoint: string) {
    return this._http.delete<T>(`${this.BASE_URL}/${endpoint}`);
  }
}
