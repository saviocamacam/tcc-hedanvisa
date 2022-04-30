import {
    Component,
    OnInit,
    QueryList,
    ViewChildren,
    OnDestroy,
    AfterViewInit,
    ChangeDetectorRef,
    ViewEncapsulation
} from "@angular/core";
import { FusePerfectScrollbarDirective } from "@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive";
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormArray,
    FormControl
} from "@angular/forms";
import { Subject } from "rxjs";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { PlanningDatabaseService } from "app/main/plannings/planning-database/planning-database.service";
import { DailyService } from "app/main/plannings/daily/daily.service";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { fuseAnimations } from "@fuse/animations";
import { PlanningsService } from "app/main/plannings/plannings.service";

@Component({
    selector: "app-planning-edit",
    templateUrl: "./planning-edit.component.html",
    styleUrls: ["./planning-edit.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PlanningEditComponent implements OnInit, OnDestroy, AfterViewInit {
    animationDirection: "left" | "right" | "none";
    course: any;
    courseStepContent: any;
    currentStep: number;
    discipline: string;
    disciplines: {}[];
    year: string;
    years: {}[];

    formPlanning: FormGroup;
    messageClass = "message-box info mb-12";
    content: String;

    @ViewChildren(FusePerfectScrollbarDirective)
    fuseScrollbarDirectives: QueryList<FusePerfectScrollbarDirective>;

    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        public planningDatabaseService: PlanningDatabaseService,
        private _planningsService: PlanningsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _dailyService: DailyService,
        private router: Router
    ) {
        // Set the defaults
        this.animationDirection = "none";
        this.currentStep = 0;
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.formPlanning = this._formBuilder.group({
            _id: [null, Validators.required],
            type: ["DailyPlanning", Validators.required],
            name: [null],
            year: [null, Validators.required],
            goal: [null],
            why: [null, Validators.required],
            theme: [null, Validators.required],
            habilities: [null],
            referencesCount: [null],
            license: ["CC0"],
            forked: [null]
        });
    }

    ngOnInit(): void {
        // Subscribe to courses
        this.planningDatabaseService.onPlanningStepsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(course => {
                // console.log(course);
                this.course = course;
            });
        // Subscribe to courses
        this._planningsService.onDisciplinesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(disciplines => {
                // console.log(disciplines);
                this.disciplines = disciplines;
            });
        // Subscribe to courses
        this._planningsService.onYearsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(years => {
                // console.log(years);
                this.years = years;
            });

        this.planningDatabaseService.planning$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(planning => {
                console.log(planning);
                this.formPlanning.controls["_id"].setValue(planning._id);
                this.content = planning.content;
                this.formPlanning.controls["theme"].setValue(
                    planning.meta.theme
                );
                this.formPlanning.controls["year"].setValue(planning.meta.year);
                this.formPlanning.controls["goal"].setValue(planning.meta.goal);
                this.formPlanning.controls["name"].setValue(planning.meta.name);
                this.formPlanning.controls["habilities"].setValue(
                    planning.meta.habilities
                );
                this.formPlanning.controls["license"].setValue(
                    planning.meta.license
                );
                this.formPlanning.controls["referencesCount"].setValue(
                    planning.meta.referencesCount
                );
                this.formPlanning.controls["forked"].setValue(
                    planning.meta.forked
                );
                this.formPlanning.addControl(
                    "references",
                    this._formBuilder.array(this.bla(planning.meta.references))
                );
                console.log(this.formPlanning.value);

                this.formPlanning
                    .get("referencesCount")
                    .valueChanges.subscribe(i => {
                        this.setItem(i);
                    });
            });
    }
    bla(references: any): any[] {
        const arr = [];
        if (references) {
            references.forEach(element => {
                console.log(element);
                arr.push(this._formBuilder.group(element));
            });
        }
        return arr;
    }
    setItem(i: number): any {
        const arr = <FormArray>this.formPlanning.controls["references"];
        if (arr.controls.length < i) {
            for (let x = arr.controls.length; x < i; x++) {
                let group = this._formBuilder.group({});
                group.addControl(
                    "reference_" + x,
                    new FormControl(null, Validators.required)
                );
                group.addControl(
                    "reference_" + x + "_link",
                    new FormControl(null)
                );
                group.addControl(
                    "reference_" + x + "_license",
                    new FormControl("CC0", Validators.required)
                );

                arr.controls.push(group);
            }
        } else if (arr.controls.length > i) {
            arr.controls.pop();
        }
        console.log(i);
        console.log(i);
    }

    ngAfterViewInit(): void {
        this.courseStepContent = this.fuseScrollbarDirectives.find(
            fuseScrollbarDirective => {
                return (
                    fuseScrollbarDirective.elementRef.nativeElement.id ===
                    "course-step-content"
                );
            }
        );
    }

    updatePlanning() {
        console.log(this.formPlanning.value);
        console.log(this.formPlanning.valid);
        console.log(this.content);
        if (this.formPlanning.valid) {
            this._dailyService
                .update(
                    {
                        meta: this.formPlanning.value,
                        content: this.content
                    },
                    this.formPlanning.get("_id").value
                )
                .then(planning => {
                    console.log(planning);
                    if (planning) {
                        this._dailyService.currentPlanning.next(planning);
                        this.router.navigate([
                            "/professor/banco-planejamentos"
                        ]);
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        }
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
     * Go to step
     *
     * @param step
     */
    gotoStep(step): void {
        // Decide the animation direction
        this.animationDirection = this.currentStep < step ? "left" : "right";

        // Run change detection so the change
        // in the animation direction registered
        this._changeDetectorRef.detectChanges();

        // Set the current step
        this.currentStep = step;
    }

    /**
     * Go to next step
     */
    gotoNextStep(): void {
        if (this.currentStep === this.course.totalSteps - 1) {
            return;
        }

        // Set the animation direction
        this.animationDirection = "left";

        // Run change detection so the change
        // in the animation direction registered
        this._changeDetectorRef.detectChanges();

        // Increase the current step
        this.currentStep++;
    }

    /**
     * Go to previous step
     */
    gotoPreviousStep(): void {
        if (this.currentStep === 0) {
            return;
        }

        // Set the animation direction
        this.animationDirection = "right";

        // Run change detection so the change
        // in the animation direction registered
        this._changeDetectorRef.detectChanges();

        // Decrease the current step
        this.currentStep--;
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    habilitiesChanged(ev) {
        console.log(ev);
        this.formPlanning.controls["habilities"].setValue(ev);
    }
}
