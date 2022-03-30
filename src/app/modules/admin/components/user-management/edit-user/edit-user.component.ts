import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AdminService } from 'src/app/services/admin.service';
import {
  ICompanyGroupModel,
  ICompanyModel,
  IUserModel,
  IZipcodeModel,
} from '../../../models/user.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  detailUser!: IUserModel;
  idUser!: string;
  @Output() sidebarEdit = new EventEmitter<boolean>();
  @Input() dataZipcode!: IZipcodeModel[];
  @Input() dataCompanyGroup!: ICompanyGroupModel[];
  submitted: boolean = false;
  formUserEdit!: FormGroup;
  dataDetailCompany!: string[];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private message: MessageService,
    private activeRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.idUser = this.activeRouter.snapshot.queryParams['idUser'];
    //gọi detail user để gán giá trị edit
    this.adminService
      .getDetailUser(this.idUser)
      .subscribe((data: IUserModel) => {
        this.detailUser = data;

        this.formUserEdit = this.fb.group({
          name: [
            this.detailUser?.name,
            Validators.compose([Validators.required, Validators.maxLength(10)]),
          ],
          age: [this.detailUser?.age, Validators.required],
          address: this.detailUser?.address,
          mail: [this.detailUser?.mail, Validators.required],
          phone: [
            this.detailUser?.phone,
            Validators.compose([Validators.required, this.validatePhone]),
          ],
          zipcode: [this.detailUser?.zipcode, Validators.required],
          companyGroup: [this.detailUser?.companyGroup, Validators.required],
          company: [this.detailUser?.company, Validators.required],
        });
      });
    //gọi lần đầu để trường hợp người dùng k đổi compnaygroup vẫn có thể chọn được compnay trong group này

    if (this.detailUser?.companyGroup.id) {
      this.adminService
        .getCompanyById(this.detailUser.companyGroup.id)
        .subscribe((data: ICompanyModel) => {
          this.dataDetailCompany = data?.company;
        });
    }
    //gán lại giá trị để edit
  }

  validatePhone(control: AbstractControl) {
    const v = control.value;
    if (v?.toString().length !== 10) {
      return { lengthPhone: true };
    }
    return null;
  }

  get age() {
    return this.formUserEdit.get('age');
  }

  submitEditUser(idUser: string) {
    this.submitted = true;
    if (this.formUserEdit.valid) {
      this.formUserEdit.patchValue({
        name: this.formUserEdit.value.name.replace(/\s+/g, ' '),
        age: +this.formUserEdit.value.age,
      });

      if (this.formUserEdit.value.age <= 16) {
        this.formUserEdit.value.address = '';
      }

      this.adminService
        .updateUser(idUser, this.formUserEdit.value)
        .subscribe(() => {
          this.formUserEdit.reset();
          this.sidebarEdit.emit(false);
          this.submitted = false;
        });

      this.message.add({
        severity: 'success',
        summary: 'Edited success !',
        life: 2000,
        key: 'edit',
      });
    }
  }

  onCancel(e: any) {
    e.preventDefault();
    this.sidebarEdit.emit(false);
    this.formUserEdit.reset();
  }

  onHideEdit() {
    this.formUserEdit.reset();
    this.sidebarEdit.emit(false);
  }

  onChangeCG(e: any) {
    this.adminService.getCompanyById(e.value.id).subscribe((data: any) => {
      this.dataDetailCompany = data?.company;
    });
  }
}
