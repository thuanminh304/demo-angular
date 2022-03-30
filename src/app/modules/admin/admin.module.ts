import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ChartManagementComponent } from './components/chart-management/chart-management.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateNewComponent } from './components/user-management/create-new/create-new.component';
import { PrimeNGModule } from '../../shared/modules/prime-ng/prime-ng.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { EditUserComponent } from './components/user-management/edit-user/edit-user.component';
import { UpperFirstLetterPipe } from 'src/app/shared/pipes/upper-first-letter.pipe';

@NgModule({
  declarations: [
    AdminComponent,
    UserManagementComponent,
    ChartManagementComponent,
    CreateNewComponent,
    EditUserComponent,
    UpperFirstLetterPipe
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    PrimeNGModule,
    SidebarModule,
    FormsModule
  ],
})
export class AdminModule {}
