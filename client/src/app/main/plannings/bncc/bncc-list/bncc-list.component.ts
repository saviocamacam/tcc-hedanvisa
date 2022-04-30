import {
    Component,
    OnInit,
    OnDestroy,
    Output,
    EventEmitter,
    Input
} from "@angular/core";
import { takeUntil, filter } from "rxjs/operators";
import { Location } from "@angular/common";
import { Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { BnccService } from "app/main/plannings/bncc/bncc.service";
import { Hability } from "app/main/plannings/bncc/hability.model";
import { fuseAnimations } from "@fuse/animations";
import { PlanningDatabaseService } from "app/main/plannings/planning-database/planning-database.service";
import { HttpParams } from "@angular/common/http";
import { PlanningsService } from "app/main/plannings/plannings.service";
import { QuestionsDatabaseService } from "app/main/questions-database/questions-database.service";

@Component({
    selector: "app-bncc-list",
    templateUrl: "./bncc-list.component.html",
    styleUrls: ["./bncc-list.component.scss"],
    animations: fuseAnimations
})
export class BnccListComponent implements OnInit, OnDestroy {
    habilities: Hability[];
    currentHability: String;
    habilitiesSelected: String[] = new Array();
    @Output() habilitiesChanged = new EventEmitter();
    @Input() discipline: String;
    @Input() year: String;
    yearViewValue: any;
    disciplineViewValue: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _bnccService: BnccService,
        private _location: Location,
        private _planningsService: PlanningsService,
        private _planningDatabaseService: PlanningDatabaseService,
        private _questionDatabaseService: QuestionsDatabaseService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
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
            const params = new HttpParams()
                .set("ano", this.yearViewValue.ordinal)
                .set("componente", this.disciplineViewValue.viewValue);
            console.log(params);
            this._bnccService.getHabilities(params);
        }
        // Subscribe to update mails on changes
        this._bnccService.onHabilitiesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(habilities => {
                this.habilities = habilities;
            });

        this._planningDatabaseService.planning$
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(planning => planning !== {})
            )
            .subscribe(planning => {
                console.log(planning);
                if (planning.meta && planning.meta.habilities) {
                    this.habilitiesSelected = planning.meta.habilities;
                }
            });
        this._questionDatabaseService.onQuestionChanged
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(question => question !== {})
            )
            .subscribe(question => {
                console.log(question);
                if (question.meta && question.meta.habilities) {
                    this.habilitiesSelected = question.meta.habilities;
                }
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    selectHability(mailId): void {
        console.log(mailId);
        this.currentHability = mailId;
    }

    itemSelected(ev) {
        console.log(ev);
        if (ev.check) {
            this.habilitiesSelected.indexOf(ev.codigo) === -1
                ? this.habilitiesSelected.push(ev.codigo)
                : console.log("This item already exists");
        } else {
            const index = this.habilitiesSelected.indexOf(ev.codigo);
            if (index !== -1) {
                this.habilitiesSelected.splice(index, 1);
            }
        }
        this.habilitiesChanged.emit(this.habilitiesSelected);
    }
}
