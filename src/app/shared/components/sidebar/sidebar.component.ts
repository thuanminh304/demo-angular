import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
  items!: MenuItem[];
  @Input() isHide!: boolean;
  labelUser: string = 'User';
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'User',
        icon: 'pi pi-users',
        routerLink: 'user',

        routerLinkActiveOptions: {
          exact: true,
        },
      },
      {
        label: 'Chart',
        icon: 'pi pi-chart-line',
        routerLink: 'chart',
      },
    ];
  }
  ngAfterViewInit(): void {
    this.adminService._isHide.subscribe((isHide) => {
    this.isHide=isHide

      this.items = [
        {
          label: isHide ? '' : 'User',
          icon: 'pi pi-users',
          routerLink: 'user',
        },
        {
          label: isHide ? '' : 'Chart',
          icon: 'pi pi-chart-line',
          routerLink: 'chart',
        },
      ];
    });
  }
}
