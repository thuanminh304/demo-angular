import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ChartManagementComponent } from './components/chart-management/chart-management.component';
import { CreateNewComponent } from './components/user-management/form-user/form-user.component';
import { UserManagementComponent } from './components/user-management/user-management.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'user',
        children: [
          { path: '', component: UserManagementComponent },
          {
            path: 'create',
            component: CreateNewComponent,
          },
        ],
      },
      {
        path: 'chart',
        component: ChartManagementComponent,
      },
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
