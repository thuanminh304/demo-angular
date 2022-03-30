import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
} from 'rxjs';
import { IUserModel } from '../modules/admin/models/user.model';
import { BaseService } from '../shared/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService extends BaseService {
  _listAllUser: BehaviorSubject<IUserModel[]> = new BehaviorSubject<
    IUserModel[]
  >([]);
  listAllUser$: Observable<IUserModel[]> = this._listAllUser.asObservable();

  sendListAllUser(value: IUserModel[]) {
    this._listAllUser.next(value);
  }

  fieldSearchDetail(field: string, fieldInput: ElementRef) {
    return fromEvent(fieldInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        map(() => {
          return fieldInput.nativeElement.value;
        })
      )
      .subscribe((searchText) => {
        this.fieldSearch(field, searchText).subscribe((data: IUserModel[]) => {
          this._listAllUser.next(data);
        });
      });
  }

  constructor(protected http: HttpClient) {
    super(http);
  }

  globalSearch(value: string) {
    return this.get<IUserModel[]>(`users?search=${value}`);
  }

  fieldSearch(field: string, value: string) {
    return this.get<IUserModel[]>(`users?${field}=${value}`);
  }

  sortby(field: string | undefined, order: string) {
    return this.get<IUserModel[]>(`users?orderBy=${field}&order=${order}`);
  }
}
