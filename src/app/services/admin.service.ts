import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  ICompanyGroupModel,
  ICompanyModel,
  IUserModel,
  IZipcodeModel,
} from '../modules/admin/models/user.model';
import { BaseService } from '../shared/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService extends BaseService {
  _isHide: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isHide$: Observable<boolean> = this._isHide.asObservable();

  sendHideValue(value: boolean) {
    this._isHide.next(value);
  }

  constructor(protected http: HttpClient) {
    super(http);
  }

  getAllUser() {
    return this.get<IUserModel[]>(`users`);
  }

  getDetailUser(idUser: string) {
    return this.get<IUserModel>(`users/${idUser}`);
  }

  getUserByPagi(page: number = 1, limit: number = 5) {
    return this.get<IUserModel[]>(`users?p=${page}&l=${limit}`);
  }

  updateUser(idUser: string | undefined, formUserEdit: IUserModel) {
    return this.put(`users/${idUser}`, formUserEdit);
  }

  getZipcode(idZipcode: string) {
    return this.get<IZipcodeModel[]>(`zipcode-${idZipcode}`);
  }

  getAllCompany() {
    return this.get<ICompanyModel[]>('company');
  }

  getCompanyById(isCompanyGroup: string) {
    return this.get<ICompanyModel>(`company/${isCompanyGroup}`);
  }

  getCompanyGroup() {
    return this.getCG<ICompanyGroupModel[]>(`companyGroup`);
  }

  createNewUser(formUser: IUserModel) {
    return this.post('users', formUser);
  }

  removeUser(idUser: string) {
    return this.delete(`users/${idUser}`);
  }
}
