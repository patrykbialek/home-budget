import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'hb-plan-project-details-summary',
  templateUrl: './plan-project-details-summary.component.html',
  styleUrls: ['./plan-project-details-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanProjectDetailsSummaryComponent {

  @Input() public dataSource: any;
  @Input() public displayedColumns: string[];
}
