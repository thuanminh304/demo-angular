import { NgModule } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {SkeletonModule} from 'primeng/skeleton';
import {PaginatorModule} from 'primeng/paginator';
import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
  exports: [
    TabMenuModule,
    MenuModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    ProgressBarModule,
    InputTextModule,
    ToastModule,
    ButtonModule,
    ContextMenuModule,
    MultiSelectModule,
    DialogModule,
    SliderModule,
    ConfirmPopupModule,
    ProgressSpinnerModule,
    SkeletonModule,
    PaginatorModule,
  ],
  providers:[MessageService,ConfirmationService]

})
export class PrimeNGModule {}
