import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'hb-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataComponent {

  displayedColumns: string[] = ['date', 'category', 'recipient', 'notes', 'amount', 'actions'];

  @Input() transactions: fromModels.Transaction[] = [];
  @Output() deleteTransaction = new EventEmitter();

  onDelete(item: fromModels.Transaction) {
    this.deleteTransaction.emit(item.key);
  }
}
