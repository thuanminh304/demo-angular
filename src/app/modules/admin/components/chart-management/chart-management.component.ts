import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as c3 from 'c3';
import { from, groupBy, map, mergeMap, Observable, toArray } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { IUserModel } from '../../models/user.model';

@Component({
  selector: 'app-chart-management',
  templateUrl: './chart-management.component.html',
  styleUrls: ['./chart-management.component.scss'],
})
export class ChartManagementComponent implements OnInit, AfterViewInit {
  listUser!: IUserModel[];

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.adminService.getAllUser().subscribe((data: IUserModel[]) => {
      this.listUser = data;

      // lọc ra mảng gồm những độ tuổi theo thứ tự tăng dần
      const ageArray = this.listUser
        .map((user) => user.age)
        .sort((a, b) => {
          return a - b;
        });

      //tạo mảng tuổi với những giá trị duy nhất
      const uniqeAgeArray = [...new Set(ageArray)];

      //chuyển thành string để show ra chart category (vì chart chỉ nhận category là string)
      const categoryAgeArray = uniqeAgeArray.map((age) => age.toString());

      //tạo mảng để lấy ra số lượng của từng độ tuổi đang có trong list
      const ageArrayFilter = [];
      for (let i of uniqeAgeArray) {
        ageArrayFilter.push(this.listUser.filter((user) => user.age === i));
      }
      const lengthAgeArray = ageArrayFilter.map((age) => age.length);

      //chart age
      c3.generate({
        bindto: '#chart',
        data: {
          columns: [['Age', ...lengthAgeArray]],
          onclick: (d) => {
            this.router.navigate(['/admin/user'], {
              queryParams: {
                age: uniqeAgeArray[d.index],
              },
            });
          },
          colors: {
            Age: '#4cc9f0',
          },
          type: 'bar',
          labels: true,

          selection: {
            enabled: true,
          },
        },

        grid: {
          x: {
            show: true,
          },
          y: {
            show: true,
          },
        },
        axis: {
          rotated: true,
          x: {
            type: 'category',
            categories: [...categoryAgeArray],
            label: 'Age',
          },
          y: {
            label: 'Quantity',
          },
        },
        bar: {
          width: {
            ratio: 0.5,
          },
        },
      });
    });
  }
}
