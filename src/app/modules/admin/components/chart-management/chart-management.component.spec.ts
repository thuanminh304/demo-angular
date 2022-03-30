import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartManagementComponent } from './chart-management.component';

describe('ChartManagementComponent', () => {
  let component: ChartManagementComponent;
  let fixture: ComponentFixture<ChartManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
