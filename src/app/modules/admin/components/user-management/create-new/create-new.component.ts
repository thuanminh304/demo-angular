import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../../../../services/admin.service';
import { IZipcodeModel, ICompanyGroupModel } from '../../../models/user.model';

@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss'],
})
export class CreateNewComponent implements OnInit {
  @Output() visibleCreate = new EventEmitter<boolean>();
  @Input() dataZipcode!: IZipcodeModel[];
  @Input() dataCompanyGroup!: ICompanyGroupModel[];

  formUser!: FormGroup;
  submitted: boolean = false;
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private message: MessageService
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

  ngOnInit(): void {
    this.formUser = this.fb.group({
      name: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(10)]),
      ],
      age: ['', Validators.required],
      address: '',
      mail: ['', Validators.compose([Validators.required])],
      phone: [null, this.validatePhone],
      zipcode: ['', Validators.required],
      companyGroup: ['', Validators.required],
      company: '',
    });
  }

  get age() {
    return this.formUser.get('age');
  }

  submitCreateUser() {
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

      this.adminService.createNewUser(this.formUser.value).subscribe(() => {
        this.formUser.reset();
        this.visibleCreate.emit(false);
        this.submitted = false;
      });

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
    this.visibleCreate.emit(false);
  }
}
