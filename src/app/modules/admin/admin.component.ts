import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
isHide:boolean=false
  constructor(private adminService:AdminService) { }

  ngOnInit(): void {
  }

  handleHideSidebar(){
    this.isHide=!this.isHide
    this.adminService.sendHideValue(this.isHide)
  }
}
