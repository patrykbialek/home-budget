import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { DataLabels, DataSourceDetails, DataSourceDetailsEntry, PlanEntry } from '@home-budget/plan/plan.model';
import { PlanService } from '@home-budget/plan/services/plan.service';

@Component({
  selector: "hb-plan-project-details-summary",
  templateUrl: "./plan-project-details-summary.component.html",
  styleUrls: ["./plan-project-details-summary.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanProjectDetailsSummaryComponent {
  @Input() public readonly dataLabels: DataLabels;
  @Input() public readonly dataSource: DataSourceDetails[];
  @Input() public readonly displayedColumns: string[];

  @Output() public goToDetails: EventEmitter<PlanEntry> = new EventEmitter();

  public onGoToDetails(element: DataSourceDetails, elementValue: DataSourceDetailsEntry): void {
    let entry: string;
    Object.keys(element).forEach((key: string) => {
      if (element[key] === elementValue) {
        entry = key;
      }
    });
    const planEntry: PlanEntry = {
      entry,
      hasEntries: elementValue.hasEntries,
      month: element.month,
      path: element.path,
    };
    this.goToDetails.emit(planEntry);
  }
}
