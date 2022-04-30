import {
    Component,
    OnInit,
    Input,
    HostBinding,
    OnDestroy,
    Output,
    EventEmitter,
    AfterContentInit
} from "@angular/core";
import { Subject } from "rxjs";
import { PlanningsService } from "app/main/plannings/plannings.service";
import { takeUntil, filter } from "rxjs/operators";
import { BnccService } from "app/main/plannings/bncc/bncc.service";
import { Hability } from "app/main/plannings/bncc/hability.model";
import { fuseAnimations } from "@fuse/animations";
import { PlanningDatabaseService } from "app/main/plannings/planning-database/planning-database.service";
import { QuestionsDatabaseService } from "app/main/questions-database/questions-database.service";

@Component({
    selector: "app-bncc-list-item",
    templateUrl: "./bncc-list-item.component.html",
    styleUrls: ["./bncc-list-item.component.scss"],
    animations: fuseAnimations
})
export class BnccListItemComponent
    implements OnInit, OnDestroy, AfterContentInit {
    @Output() itemSelected = new EventEmitter();
    @Input() hability: any;
    labels: any[];

    @HostBinding("class.selected")
    selected: boolean;
    card9Expanded: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MailService} _bnccService
     */
    constructor(
        private _bnccService: BnccService,
        private _planningDatabaseService: PlanningDatabaseService,
        private _questionDatabaseService: QuestionsDatabaseService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngAfterContentInit(): void {
        // console.log(this.hability);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Set the initial values
        this.hability = new Hability(this.hability);

        this._planningDatabaseService.planning$
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(planning => planning != null)
            )
            .subscribe(planning => {
                if (
                    planning.meta &&
                    planning.meta.habilities &&
                    planning.meta.habilities.includes(this.hability.$codigo)
                ) {
                    this.hability.check = true;
                }
                console.log(this.hability);
            });

        this._questionDatabaseService.onQuestionChanged
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(question => question != null)
            )
            .subscribe(question => {
                if (
                    question.meta &&
                    question.meta.habilities &&
                    question.meta.habilities.includes(this.hability.$codigo)
                ) {
                    this.hability.check = true;
                }
                console.log(this.hability);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On selected change
     */
    onSelectedChange(): void {
        this.itemSelected.emit(this.hability);
        this._bnccService.toggleSelectedMail(this.hability.id);
    }
}
