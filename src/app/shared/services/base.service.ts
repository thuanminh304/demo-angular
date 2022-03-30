import { Injectable } from '@angular/core';
import { environment as evn } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { IUserModel } from '../../modules/admin/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor(protected _http: HttpClient) {}

  get<T>(endpoint: string) {
    return this._http.get<T>(`${evn.BASE_URL}/${endpoint}`);
  }
  getCG<T>(endpoint: string) {
    return this._http.get<T>(`${evn.URL_COMPANY_GROUP}/${endpoint}`);
  }
  post(endpoint: string, formUser: IUserModel) {
    return this._http.post(`${evn.BASE_URL}/${endpoint}`, formUser);
  }

  put(endpoint: string, formUser: IUserModel) {
    return this._http.put(`${evn.BASE_URL}/${endpoint}`, formUser);
  }

  delete<T>(endpoint: string) {
    return this._http.delete<T>(`${evn.BASE_URL}/${endpoint}`);
  }
}
