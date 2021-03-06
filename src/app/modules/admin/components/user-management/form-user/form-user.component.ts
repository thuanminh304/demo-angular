import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
  concat,
  concatMap,
  delay,
  ErrorObserver,
  mergeMap,
  of,
  Subscription,
} from 'rxjs';
import { AdminService } from '../../../../../services/admin.service';
import {
  IZipcodeModel,
  ICompanyGroupModel,
  IUserModel,
  ICompanyModel,
} from '../../../models/user.model';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss'],
})
export class CreateNewComponent implements OnInit, OnDestroy {
  @Output() visibleDialog = new EventEmitter<boolean>();
  @Input() dataZipcode!: IZipcodeModel[];
  @Input() dataCompanyGroup!: ICompanyGroupModel[];
  @Input() isCreate: boolean = false;
  @Input() isEdit: boolean = false;

  formUser!: FormGroup;
  detailUser!: IUserModel;
  dataDetailCompany!: string[];
  idUser!: string;
  submitted: boolean = false;
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private message: MessageService,
    private activeRouter: ActivatedRoute
  ) {}

  validatePhone(control: AbstractControl) {
    const v = control.value;
    if (v?.toString().length === 0) {
      return { required: true };
    } else if (v?.toString().length !== 10) {
      return { lengthPhone: true };
    }
    return null;
  }
  subUser!: Subscription;
  ngOnInit(): void {
    this.formUser = this.fb.group({
      name: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(10)]),
      ],
      age: ['', Validators.required],
      address: '',
      mail: ['', Validators.required],
      phone: [null, this.validatePhone],
      zipcode: ['', Validators.required],
      companyGroup: ['', Validators.required],
      company: '',
    });

    if (!this.isCreate && this.isEdit) {
      //g???i detail user ????? g??n gi?? tr??? edit
      this.idUser = this.activeRouter.snapshot.queryParams['idUser'];

      this.subUser = this.adminService
        .getDetailUser(this.idUser)
        .pipe(
          concatMap((data: IUserModel) => {
            this.detailUser = data;

            this.formUser = this.fb.group({
              name: [
                this.detailUser?.name,
                Validators.compose([
                  Validators.required,
                  Validators.maxLength(10),
                ]),
              ],
              age: [this.detailUser?.age, Validators.required],
              address: this.detailUser?.address,
              mail: [this.detailUser?.mail, Validators.required],
              phone: [this.detailUser?.phone, this.validatePhone],
              zipcode: [this.detailUser?.zipcode, Validators.required],
              companyGroup: [
                this.detailUser?.companyGroup,
                Validators.required,
              ],
              company: [this.detailUser?.company, Validators.required],
            });

            return this.adminService.getCompanyById(
              this.detailUser?.companyGroup.id
            );
          })
        )
        .subscribe(
          (company) => {
            this.dataDetailCompany = company.company;
          },
          (err: HttpErrorResponse) => {
            if (err.message.includes('company')) {
              alert('company invalid');
            }
          }
        );
    }
  }

  get age() {
    return this.formUser.get('age');
  }
  onChangeCG(e: any) {
    this.adminService.getCompanyById(e.value.id).subscribe((data: any) => {
      this.dataDetailCompany = data?.company;
    });
  }

  submitUser() {
    this.submitted = true;
    //loai bo khoang trang

    if (this.formUser.valid) {
      this.formUser.patchValue({
        name: this.formUser.value.name.replace(/\s+/g, ' '),
        age: +this.formUser.value.age,
      });

      if (this.formUser.value.age <= 16) {
        this.formUser.value.address = '';
      }
      
      if (this.isCreate && !this.isEdit) {
        this.adminService.createNewUser(this.formUser.value).subscribe(() => {
          this.formUser.reset();
          this.visibleDialog.emit(false);
          this.submitted = false;
        });
      } else {
        this.adminService
          .updateUser(this.detailUser.id, this.formUser.value)
          .subscribe(() => {
            this.formUser.reset();
            this.visibleDialog.emit(false);
            this.submitted = false;
          });
      }

      this.message.add({
        severity: 'success',
        summary: 'Created success !',
        life: 2000,
        key: 'create',
      });
    }
  }

  onCancel(e: any) {
    e.preventDefault();
    this.formUser.reset();
    this.visibleDialog.emit(false);
  }

  ngOnDestroy(): void {
    if (this.detailUser) {
      this.subUser.unsubscribe();
      console.log('destroy');
    }
  }
}
