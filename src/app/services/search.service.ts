import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { IUserModel } from '../modules/admin/models/user.model';
import { BaseService } from '../shared/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService extends BaseService {
  fieldSearchDetail(fieldInput: ElementRef) {
    return fromEvent(fieldInput.nativeElement, 'keyup').pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      map(() => {
        return fieldInput.nativeElement.value;
      })
    );
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
