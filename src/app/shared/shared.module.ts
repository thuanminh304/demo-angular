import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PrimeNGModule } from './modules/prime-ng/prime-ng.module';
import { SkeletonDirective } from './components/skeleton/skeleton.component';



@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    SkeletonDirective,
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
  ]
  ,
  exports:[
    SidebarComponent,
    NavbarComponent,
    SkeletonDirective
  ],
})
export class SharedModule { }
