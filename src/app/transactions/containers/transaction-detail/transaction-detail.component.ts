import { Component, OnInit } from '@angular/core';
import { CommonWithAnimationComponent } from '@shared/components';

@Component({
  selector: 'hb-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent extends CommonWithAnimationComponent implements OnInit {

  constructor(
  ) {
    super();
  }

  ngOnInit() {
    
  }
}
