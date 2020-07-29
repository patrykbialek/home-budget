import { Component } from '@angular/core';

@Component({
  selector: 'hb-app-spinner',
  template: `
    <section class="c-spinner">
      <mat-spinner [diameter]="64" [strokeWidth]="5"></mat-spinner>
    </section>
  `,
  styleUrls: ['./app-spinner.component.scss']
})
export class AppSpinnerComponent { }
