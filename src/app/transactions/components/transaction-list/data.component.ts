import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'hb-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataComponent {

  displayedColumns: string[] = ['date', 'category', 'recipient', 'notes', 'amount'];

  @Input() transactions: fromModels.Transaction[];

}
