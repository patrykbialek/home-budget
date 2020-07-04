import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'hb-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataComponent implements OnInit {

  @Input() transactions: fromModels.Transaction[];

  constructor() { }

  ngOnInit(): void {
  }

}
