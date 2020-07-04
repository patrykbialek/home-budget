import { Component, ViewChild, ElementRef, AfterContentInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-main-component',
  template: `
    <main class="o-wrapper c-main" #main>
      <ng-content></ng-content>
    </main>
  `,
})
export class CommonWithAnimationComponent implements AfterViewInit {

  @ViewChild('main') mainHTML: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.mainHTML) {
        this.mainHTML.nativeElement.style.opacity = '1';
        // this.mainHTML.nativeElement.style.paddingTop = '96px';
      }
    }, 300);
  }
}