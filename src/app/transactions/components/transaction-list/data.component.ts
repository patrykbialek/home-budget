import {
  ChangeDetectionStrategy, Component,
  EventEmitter, Input,
  OnChanges, Output, SimpleChanges
} from '@angular/core';
import { WindowSize } from '@home-budget/shared/models';
import * as fromModels from '@home-budget/transactions/models';

@Component({
  selector: 'hb-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataComponent implements OnChanges {

  displayedColumnsForDesktopSize: string[] = ['date', 'category', 'recipient', 'notes', 'amount', 'actions'];
  displayedColumnsForMobileSize: string[] = ['date', 'recipient', 'amount', 'actions'];
  displayedColumns = this.displayedColumnsForDesktopSize;

  @Input() isLoading: boolean;
  @Input() transactions: fromModels.Transaction[] = [];
  @Input() windowSize: string;
  @Output() deleteTransaction = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
    if (changes.windowSize) {
      this.windowSize = changes.windowSize.currentValue;
      if (changes.windowSize.currentValue === WindowSize.Desktop) {
        this.displayedColumns = this.displayedColumnsForDesktopSize;
      } else {
        this.displayedColumns = this.displayedColumnsForMobileSize;
      }
    }
  }

  onDelete(item: fromModels.Transaction) {
    this.deleteTransaction.emit(item.key);
  }
}
