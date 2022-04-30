import {
    Component,
    OnInit,
    OnDestroy,
    AfterViewInit,
    QueryList,
    ViewChildren,
    ChangeDetectorRef,
    ViewEncapsulation
} from "@angular/core";
import { Subject } from "rxjs";
import { FusePerfectScrollbarDirective } from "@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive";
import { QuestionsDatabaseService } from "app/main/questions-database/questions-database.service";
import { takeUntil } from "rxjs/operators";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { fuseAnimations } from "@fuse/animations";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PlanningsService } from "app/main/plannings/plannings.service";
import { QuestionsCenterService } from "app/main/questions-database/questions-center/questions-center-service.service";
import { Router } from "@angular/router";
import { AttentionAlertDialogComponent } from "app/main/alerts/attention/attention.component";
import { MatDialog } from "@angular/material";

@Component({
    selector: "app-questions-new",
    templateUrl: "./questions-new.component.html",
    styleUrls: ["./questions-new.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class QuestionsNewComponent implements OnInit, OnDestroy, AfterViewInit {
    animationDirection: "left" | "right" | "none";
    content: any;
    course: any;
    courseStepContent: any;
    currentStep: number;
    answer: String;
    discipline: string;
    disciplines: {}[];
    year: string;
    years: {}[];
    formQuestion: FormGroup;
    answerTypes = [
        { value: "objective", viewValue: "Objetiva simples" }
        // { value: "objectiveEditor", viewValue: "Objetiva com editor" },
        // { value: "discursive", viewValue: "Discursiva" }
    ];
    levels = [
        { value: 1, viewValue: "Fácil" },
        { value: 2, viewValue: "Médio" },
        { value: 3, viewValue: "Difícil" }
    ];

    @ViewChildren(FusePerfectScrollbarDirective)
    fuseScrollbarDirectives: QueryList<FusePerfectScrollbarDirective>;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _planningService: PlanningsService,
        private _questionsDatabaseService: QuestionsDatabaseService,
        private _questionsCenterService: QuestionsCenterService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseSidebarService: FuseSidebarService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private router: Router
    ) {
        this.formQuestion = this._formBuilder.group({
            type: ["Question", Validators.required],
            theme: [null, Validators.required],
            year: [null, Validators.required],
            level: [null, Validators.required],
            answer: [null],
            answer_objective: this._formBuilder.array([this.createItem()]),
            answerType: [null, Validators.required],
            correctAnswer: [null],
            goal: [null, Validators.required],
            descriptors: [null],
            habilities: [null]
        });
        // Set the defaults
        this.animationDirection = "none";
        this.currentStep = 0;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    createItem(): any {
        return this._formBuilder.group({
            0: [null, Validators.required],
            1: [null, Validators.required],
            2: [null, Validators.required],
            3: [null, Validators.required]
        });
    }

    ngOnInit() {
        // console.log(this.formQuestion.get("answer_objective").value);
        // Subscribe to courses
        this._questionsDatabaseService.onQuestionsStepsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(course => {
                this.course = course;
            });
        // Subscribe to courses
        this._planningService.onDisciplinesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(disciplines => {
                console.log(disciplines);
                this.disciplines = disciplines;
            });
        // Subscribe to courses
        this._planningService.onYearsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(years => {
                console.log(years);
                this.years = years;
            });
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

    saveQuestion() {
        console.log(this.formQuestion.value);
        console.log(this.content);
        if (this.formQuestion.valid && this.content) {
            this._questionsCenterService
                .save({
                    meta: this.formQuestion.value,
                    content: this.content
                })
                .then(question => {
                    console.log(question);
                    if (question) {
                        this.router.navigate(["/professor/banco-questoes"]);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            this._matDialog.open(AttentionAlertDialogComponent, {
                width: "400px",
                data: {
                    justification: `Verifique se não deixou algum passo obrigatório em branco.`
                }
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
        this.formQuestion.controls["habilities"].setValue(ev);
    }

    descriptoresChanged(ev) {
        console.log(ev);
        this.formQuestion.controls["descriptors"].setValue(ev);
    }
}
