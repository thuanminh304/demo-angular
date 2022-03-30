import { Component, Directive, OnInit } from '@angular/core';

@Component({
  selector: 'appSkeleton',
  templateUrl: './skeleton.component.html',
})
export class SkeletonDirective implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
