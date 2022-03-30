import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';

import { Table } from 'primeng/table';
import { forkJoin, Observable, Subject } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';
import { AdminService } from '../../../../services/admin.service';
import {
  ICompanyGroupModel,
  IUserModel,
  IZipcodeModel,
} from '../../models/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit, AfterViewInit {
  @ViewChild('searchvalue', { static: true }) input!: ElementRef;
  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('ageInput') ageInput!: ElementRef;
  @ViewChild('mailInput') mailInput!: ElementRef;
  @ViewChild('phoneInput') phoneInput!: ElementRef;
  @ViewChild('addressInput') addressInput!: ElementRef;
  @ViewChild('dt') table!: Table;

  results$!: Observable<any>;
  subject = new Subject();

  customers: IUserModel[] = [];
  selectedCustomers: IUserModel[] = [];

  loading: boolean = true;

  dataZipcode!: IZipcodeModel[];
  dataUserDetail!: IUserModel;

  visibleSidebar!: boolean;
  visibleSidebarEdit!: boolean;
  dataCompanyGroup!: ICompanyGroupModel[];
  dataAllCompany: string[] = [];
  valueGlobalSearch!: string;

  ageFromChart!: string;
  listALlUser!: IUserModel[];
  pageSize: number = 5;
  pageCurrent: number = 1;
  totalRecord!: number;

  receiveValueVisibleCreate(e: any) {
    this.visibleSidebar = e;
    this.getAllUser();
  }

  receiveValueSidebarEdit(e: any) {
    this.visibleSidebarEdit = e;
    this.getAllUser();
  }
  constructor(
    private adminService: AdminService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private confirmationService: ConfirmationService,
    private activeRoute: ActivatedRoute,
    private searchService: SearchService,
    private message: MessageService
  ) {}
  onPagi(e: any) {
    const page = Math.ceil((e.first + 1) / e.rows);
    this.pageCurrent = page;
    this.pageSize = e.rows;

    //theo dõi queryparams để search theo đúng field
    this.activeRoute.queryParamMap.subscribe((data) => {
      if (data.has('name')) {
        this.router.navigate(['/admin/user'], {
          queryParams: {
            name: this.nameInput.nativeElement.value,
            p: this.pageCurrent,
            l: this.pageSize,
          },
        });
      } else if (data.has('mail')) {
        this.router.navigate(['/admin/user'], {
          queryParams: {
            mail: this.mailInput.nativeElement.value,
            p: this.pageCurrent,
            l: this.pageSize,
          },
        });
      } else if (data.has('age')) {
        this.router.navigate(['/admin/user'], {
          queryParams: {
            age: this.ageInput.nativeElement.value,
            p: this.pageCurrent,
            l: this.pageSize,
          },
        });
      } else if (data.has('phone')) {
        this.router.navigate(['/admin/user'], {
          queryParams: {
            phone: this.phoneInput.nativeElement.value,
            p: this.pageCurrent,
            l: this.pageSize,
          },
        });
      } else if (data.has('address')) {
        this.router.navigate(['/admin/user'], {
          queryParams: {
            address: this.addressInput.nativeElement.value,
            p: this.pageCurrent,
            l: this.pageSize,
          },
        });
      } else if (data.has('search')) {
        this.router.navigate(['/admin/user'], {
          queryParams: {
            search: this.input.nativeElement.value,
            p: this.pageCurrent,
            l: this.pageSize,
          },
        });
      } else {
        this.router.navigate(['/admin/user'], {
          queryParams: {
            p: this.pageCurrent,
            l: this.pageSize,
          },
        });
      }
    });
  }

  ngOnInit(): void {
    //reset url if f5 or navigate
    if (this.router['navigationId'] === 1) {
      this.router.navigate(['/admin/user']);
    }
    //search age khi click vào mỗi bar chart
    this.ageFromChart = this.activeRoute.snapshot.queryParams['age'];
    if (this.ageFromChart !== undefined) {
      this.searchService
        .fieldSearch('age', this.ageFromChart)
        .subscribe((data: any) => {
          this.ageInput.nativeElement.value = this.ageFromChart;

          this.loading = false;
          this.customers = data;
        });
    } else {
      this.adminService.getAllUser().subscribe((data: IUserModel[]) => {
        this.customers = data;
        this.loading = false;
      });
    }

    //get all user for first loading page

    forkJoin({
      zipcode1: this.adminService.getZipcode('1'),
      zipcode2: this.adminService.getZipcode('2'),
      companyGroup: this.adminService.getCompanyGroup(),
      company: this.adminService.getAllCompany(),
      allUser: this.adminService.getAllUser(),
    }).subscribe(({ zipcode1, zipcode2, companyGroup, company, allUser }) => {
      this.dataZipcode = [...zipcode1, ...zipcode2];
      this.dataCompanyGroup = companyGroup;
      company.map((company) => {
        this.dataAllCompany.push(...company.company);
      });
      this.listALlUser = allUser;
      this.totalRecord = this.listALlUser.length;
    });

    this.primengConfig.ripple = true;
  }

  getAllUser() {
    this.adminService.getAllUser().subscribe((data: IUserModel[]) => {
      this.customers = data;
      this.loading = false;
    });
  }

  //remove each user and multi
  confirmRemove(event: any, idUser: string) {
    const index = this.customers.findIndex((user) => {
      return user.id === idUser;
    });
    if (index !== -1) {
      this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to remove this user?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.adminService.removeUser(idUser).subscribe(() => {
            this.getAllUser();
          });
          this.message.add({
            severity: 'success',
            summary: 'Removed success !',
            life: 2000,
            key: 'remove' + idUser,
          });
        },
      });
    }
  }

  multipleRemove(event: any) {
    const obs = new Observable((observe) => {
      for (let item in this.selectedCustomers) {
        observe.next(this.selectedCustomers[item].id);
      }
    });

    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to remove this users?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        obs.subscribe((data: any) => {
          this.adminService.removeUser(data).subscribe(() => {
            this.getAllUser();
          });
        });
        this.totalRecord = this.totalRecord - this.selectedCustomers.length;

        this.message.add({
          severity: 'success',
          summary: 'Removed success !',
          life: 2000,
          key: 'multiRemove',
        });
      },
    });
  }

  handleCheckbox($event: any) {
    console.log(this.selectedCustomers);
  }

  onShowEdit(idUser: string) {
    const index = this.customers.findIndex((item) => item.id === idUser);
    if (index !== -1) {
      this.visibleSidebarEdit = true;
      this.router.navigate(['/admin/user'], {
        queryParams: {
          idUser: idUser,
        },
      });
    }
  }

  //filter global and field
  globalSearchUser(evt: any) {
    //xét lại valut field='' khi thực hiện search global
    this.nameInput.nativeElement.value = '';
    this.ageInput.nativeElement.value = '';
    this.mailInput.nativeElement.value = '';
    this.addressInput.nativeElement.value = '';
    this.phoneInput.nativeElement.value = '';

    const searchText = evt.target.value.trim();
    this.router.navigate(['/admin/user'], {
      queryParams: {
        search: searchText,
        p: this.pageCurrent,
        l: this.pageSize,
      },
    });
    this.subject.next(searchText);
    this.loading = true;
  }

  filterName(evt: any) {
    const searchText = evt.target.value.trim();
    this.router.navigate(['/admin/user'], {
      queryParams: {
        name: searchText,
        p: this.pageCurrent,
        l: this.pageSize,
      },
    });
    this.subject.next(searchText);
    this.loading = true;
  }

  filterAge(evt: any) {
    const searchText = evt.target.value.trim();
    this.router.navigate(['/admin/user'], {
      queryParams: {
        age: searchText,
        p: this.pageCurrent,
        l: this.pageSize,
      },
    });
    this.subject.next(searchText);
    this.loading = true;
  }

  filterMail(evt: any) {
    const searchText = evt.target.value.trim();
    this.router.navigate(['/admin/user'], {
      queryParams: {
        mail: searchText,
        p: this.pageCurrent,
        l: this.pageSize,
      },
    });
    this.subject.next(searchText);
    this.loading = true;
  }

  filterPhone(evt: any) {
    const searchText = evt.target.value.trim();
    this.router.navigate(['/admin/user'], {
      queryParams: {
        phone: searchText,
        p: this.pageCurrent,
        l: this.pageSize,
      },
    });
    this.subject.next(searchText);
    this.loading = true;
  }

  filterAddress(evt: any) {
    const searchText = evt.target.value.trim();
    this.router.navigate(['/admin/user'], {
      queryParams: {
        address: searchText,
        p: this.pageCurrent,
        l: this.pageSize,
      },
    });
    this.subject.next(searchText);
    this.loading = true;
  }

  //theo dõi giá trị input và tìm kiếm sau 1s

  ngAfterViewInit(): void {
    this.searchService.fieldSearchDetail(this.input).subscribe((searchText) => {
      this.searchService.globalSearch(searchText).subscribe((data: any) => {
        this.loading = false;
        this.customers = data;
        if (searchText !== '') {
          this.totalRecord = data.length;
        } else {
          this.totalRecord = this.listALlUser.length;
        }
      });
    });

    this.searchService
      .fieldSearchDetail(this.nameInput)
      .subscribe((searchText) => {
        this.searchService
          .fieldSearch('name', searchText)
          .subscribe((data: IUserModel[]) => {
            this.loading = false;
            this.customers = data;
          });
      });

    this.searchService
      .fieldSearchDetail(this.ageInput)
      .subscribe((searchText) => {
        this.searchService
          .fieldSearch('age', searchText)
          .subscribe((data: IUserModel[]) => {
            this.loading = false;
            this.customers = data;
          });
      });

    this.searchService
      .fieldSearchDetail(this.mailInput)
      .subscribe((searchText) => {
        this.searchService
          .fieldSearch('mail', searchText)
          .subscribe((data: IUserModel[]) => {
            this.loading = false;
            this.customers = data;
          });
      });

    this.searchService
      .fieldSearchDetail(this.phoneInput)
      .subscribe((searchText) => {
        this.searchService
          .fieldSearch('phone', searchText)
          .subscribe((data: IUserModel[]) => {
            this.loading = false;
            this.customers = data;
          });
      });

    this.searchService
      .fieldSearchDetail(this.addressInput)
      .subscribe((searchText) => {
        this.searchService
          .fieldSearch('address', searchText)
          .subscribe((data: IUserModel[]) => {
            this.loading = false;
            this.customers = data;
          });
      });
  }
}
