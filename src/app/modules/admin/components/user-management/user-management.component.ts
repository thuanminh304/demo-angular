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
  dataZipcode!: IZipcodeModel[];
  dataUserDetail!: IUserModel;
  listALlUser!: IUserModel[];
  dataCompanyGroup!: ICompanyGroupModel[];

  loading: boolean = true;

  dataAllCompany: string[] = [];
  valueGlobalSearch!: string;
  ageFromChart!: string;

  pageSize: number = 5;
  pageCurrent: number = 1;
  totalRecord!: number;

  displayModal!: boolean;
  isCreate: boolean = false;
  isEdit: boolean = false;
  headerCreate: string = 'Create New User';
  headerEdit: string = 'Edit User';
  
  fieldName: any[] = [
    { field: 'name', input: true, viewchild: '#nameInput' },
    { field: 'mail', input: true, viewchild: '#mailInput' },
    { field: 'age', input: true, viewchild: 'ageInput' },
    { field: 'phone', input: true, viewchild: '#phoneInput' },
    { field: 'address', input: true, viewchild: '#addressInput' },
    { field: 'zipcode', input: false, viewchild: '#zipcodeInput' },
    { field: 'company', input: false, viewchild: '#companyInput' },
  ];

  receiveValueVisibleDialog(e: any) {
    this.displayModal = e;
    this.getAllUser();
    this.router.navigate(['/admin/user']);
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
    console.log(e);
    const page = Math.ceil((e.first + 1) / e.rows);
    this.pageCurrent = page;
    this.pageSize = e.rows;

    //theo dõi queryparams để search theo đúng field
    this.activeRoute.queryParamMap.subscribe((data) => {
      console.log(data);

      const field = data['keys'][0];
      if (field !== 'p' && data.has(field)) {
        this.router.navigate(['/admin/user'], {
          queryParams: {
            [field]: data.get(field),
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

    this.searchService.listAllUser$.subscribe((data: IUserModel[]) => {
      if (data.length !== 0) {
        console.log('first');
        this.customers = data;
      }
    });
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
        key: 'remove' + idUser,
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
      key: 'multiRemove',
      accept: () => {
        obs.subscribe((data: any) => {
          this.adminService.removeUser(data).subscribe(() => {});
        });
        this.getAllUser();

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
    this.displayModal = true;
    console.log(idUser);
    this.isCreate = false;
    this.isEdit = true;
    const index = this.customers.findIndex((item) => item.id === idUser);
    if (index !== -1) {
      this.router.navigate(['/admin/user'], {
        queryParams: {
          idUser: idUser,
        },
      });
    }
  }
  onShowCreate() {
    this.displayModal = true;
    this.isEdit = false;
    this.isCreate = true;
  }
  onHideDialog() {
    console.log('first');
    this.displayModal = false;
    this.isEdit = false;
    this.isCreate = false;
  }

 
  //filter global and field
  globalSearchUser(evt: any) {
    //xét lại valut field='' khi thực hiện search global
    this.nameInput.nativeElement.value = '';
    this.ageInput.nativeElement.value = '';
    this.mailInput.nativeElement.value = '';
    this.addressInput.nativeElement.value = '';
    this.phoneInput.nativeElement.value = '';

    this.applyFilter(evt, 'search');
  }

  applyFilter(evt: any, field: string) {
    const searchText = evt.target.value.trim();
    this.router.navigate(['/admin/user'], {
      queryParams: {
        [field]: searchText,
        p: this.pageCurrent,
        l: this.pageSize,
      },
    });
    this.subject.next(searchText);
    // this.loading = true;
  }

  //theo dõi giá trị input và tìm kiếm sau 1s

  ngAfterViewInit(): void {
    this.searchService.fieldSearchDetail('search', this.input);
    this.searchService.fieldSearchDetail('mail', this.mailInput);
    this.searchService.fieldSearchDetail('name', this.nameInput);
    this.searchService.fieldSearchDetail('age', this.ageInput);
    this.searchService.fieldSearchDetail('phone', this.phoneInput);
    this.searchService.fieldSearchDetail('address', this.addressInput);
  }
}
