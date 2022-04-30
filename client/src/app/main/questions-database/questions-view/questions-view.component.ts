import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { takeUntil, filter } from "rxjs/operators";
import { Subject } from "rxjs";
import { PlanningsService } from "app/main/plannings/plannings.service";
import { QuestionsDatabaseService } from "app/main/questions-database/questions-database.service";
import { Location } from "@angular/common";

@Component({
    selector: "app-questions-view",
    templateUrl: "./questions-view.component.html",
    styleUrls: ["./questions-view.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class QuestionsViewComponent implements OnInit, OnDestroy {
    teste: any = "bla";
    question: any;
    discipline: string;
    disciplines: {}[];
    year: string;
    years: {}[];
    answers: any;
    private _unsubscribeAll: Subject<any>;
    constructor(
        private _planningService: PlanningsService,
        private _questionsDatabaseService: QuestionsDatabaseService,
        private _location: Location
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        // Subscribe to courses
        this._planningService.onDisciplinesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(disciplines => {
                // console.log(disciplines);
                this.disciplines = disciplines;
            });
        // Subscribe to courses
        this._planningService.onYearsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(years => {
                // console.log(years);
                this.years = years;
            });

        this._questionsDatabaseService.onQuestionChanged
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(question => question != null)
            )
            .subscribe(question => {
                console.log(question);
                this.question = question;
                this.answers = Object.values(question.meta.answer_objective[0]);
            });
    }

    ngOnDestroy(): void {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    back() {
        this._location.back();
    }
}
