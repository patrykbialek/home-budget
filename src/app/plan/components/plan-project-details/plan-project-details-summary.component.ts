import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { PlanService } from '@home-budget/plan/services/plan.service';

@Component({
  selector: "hb-plan-project-details-summary",
  templateUrl: "./plan-project-details-summary.component.html",
  styleUrls: ["./plan-project-details-summary.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanProjectDetailsSummaryComponent {
  @Input() public dataLabels: { [key: string]: string };
  @Input() public dataSource: any;
  @Input() public displayedColumns: string[];

  @Output() public goToDetails: EventEmitter<any> = new EventEmitter();

  constructor(private readonly planService: PlanService) {}

  public onGoToDetails(element: any, value: number): void {
    let entry: string;
    Object.keys(element).forEach((key: string) => {
      if (element[key] === value) {
        entry = key;
      }
    });
    const event = {
      entry,
      type: element.type,
      month: element.month,
      monthId: element.monthId,
      path: element.path,
    };
    this.goToDetails.emit(event);
  }
}
