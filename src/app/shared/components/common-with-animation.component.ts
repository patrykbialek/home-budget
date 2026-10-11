import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'hb-main-component',
  template: `
    <main class="o-wrapper c-main" #main>
      <ng-content></ng-content>
    </main>
  `
})
export class CommonWithAnimationComponent implements AfterViewInit {
  @ViewChild('main') mainHTML!: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.mainHTML) {
        this.mainHTML.nativeElement.style.opacity = '1';
      }
    }, 300);
  }
}
