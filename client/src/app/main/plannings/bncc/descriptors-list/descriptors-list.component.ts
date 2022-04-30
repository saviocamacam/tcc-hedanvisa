import {
    Component,
    OnInit,
    EventEmitter,
    Output,
    OnDestroy,
    Input
} from "@angular/core";
import { Subject } from "rxjs";
import { PlanningsService } from "app/main/plannings/plannings.service";
import { takeUntil, filter } from "rxjs/operators";

import { BnccService } from "app/main/plannings/bncc/bncc.service";
import { fuseAnimations } from "@fuse/animations";
import { QuestionsDatabaseService } from "app/main/questions-database/questions-database.service";

@Component({
    selector: "app-descriptors-list",
    templateUrl: "./descriptors-list.component.html",
    styleUrls: ["./descriptors-list.component.scss"],
    animations: fuseAnimations
})
export class DescriptorsListComponent implements OnInit, OnDestroy {
    descriptors: any;
    currentDescriptor: String;
    descriptorsSelected: String[] = new Array();
    @Output() descriptorsChanged = new EventEmitter();
    @Input() discipline: String;
    @Input() year: String;
    yearViewValue: any;
    disciplineViewValue: any;
    private _unsubscribeAll: Subject<any>;
    constructor(
        private _planningsService: PlanningsService,
        private _bnccService: BnccService,
        private _questionDatabaseService: QuestionsDatabaseService
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        console.log(this.discipline);
        console.log(this.year);
        // Subscribe to courses
        this._planningsService.onDisciplinesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(disciplines => {
                console.log(disciplines);
                this.disciplineViewValue = disciplines.find(
                    el => el.id === this.discipline
                );
            });
        // Subscribe to courses
        this._planningsService.onYearsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(years => {
                console.log(years);
                this.yearViewValue = years.find(el => el.id === this.year);
            });
        if (this.yearViewValue && this.disciplineViewValue) {
            console.log(this.yearViewValue.ordinal);
            console.log(this.disciplineViewValue.viewValue);

            this._bnccService
                .getDescriptors(this.disciplineViewValue.viewValue)
                .then(res => {
                    console.log(res);
                });
        }
        this._bnccService.onDescriptorsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(descriptors => {
                this.descriptors = descriptors;
            });

        this._questionDatabaseService.onQuestionChanged
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(question => question !== {})
            )
            .subscribe(question => {
                console.log(question);
                if (question.meta && question.meta.descriptors) {
                    this.descriptorsSelected = question.meta.descriptors;
                }
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    selectDescriptor(descriptor) {
        this.currentDescriptor = descriptor;
    }

    itemSelected(ev) {
        console.log(ev);
        if (ev.check) {
            this.descriptorsSelected.indexOf(ev.codigo) === -1
                ? this.descriptorsSelected.push(ev.codigo)
                : console.log("This item already exists");
        } else {
            const index = this.descriptorsSelected.indexOf(ev.codigo);
            if (index !== -1) {
                this.descriptorsSelected.splice(index, 1);
            }
        }
        this.descriptorsChanged.emit(this.descriptorsSelected);
    }
}
