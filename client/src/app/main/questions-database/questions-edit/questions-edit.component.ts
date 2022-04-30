import {
    Component,
    OnInit,
    AfterViewInit,
    OnDestroy,
    ChangeDetectorRef,
    ViewEncapsulation,
    QueryList,
    ViewChildren
} from "@angular/core";
import { PlanningsService } from "app/main/plannings/plannings.service";
import { QuestionsCenterService } from "app/main/questions-database/questions-center/questions-center-service.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { QuestionsDatabaseService } from "app/main/questions-database/questions-database.service";
import { fuseAnimations } from "@fuse/animations";
import { FusePerfectScrollbarDirective } from "@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive";
import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { DailyService } from "app/main/plannings/daily/daily.service";

@Component({
    selector: "app-questions-edit",
    templateUrl: "./questions-edit.component.html",
    styleUrls: ["./questions-edit.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class QuestionsEditComponent
    implements OnInit, OnDestroy, AfterViewInit {
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
        { value: "objective", viewValue: "Objetiva simples" },
        { value: "objectiveEditor", viewValue: "Objetiva com editor" },
        { value: "discursive", viewValue: "Discursiva" }
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
        private _dailyService: DailyService,
        private router: Router
    ) {
        this.formQuestion = this._formBuilder.group({
            _id: [null, Validators.required],
            type: ["Question", Validators.required],
            theme: [null, Validators.required],
            year: [null, Validators.required],
            level: [null, Validators.required],
            answer: [null],
            correctAnswer: [null],
            // answer_objective: this._formBuilder.array([this.createItem()]),
            answerType: [null, Validators.required],
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

    setItem(items): any {
        console.log(items);
        return this._formBuilder.group({
            0: [items[0]],
            1: [items[1]],
            2: [items[2]],
            3: [items[3]]
        });
    }

    ngOnInit() {
        this._questionsDatabaseService.onQuestionsStepsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(course => {
                this.course = course;
            });
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
                this.formQuestion.controls["_id"].setValue(question._id);
                this.content = question.content;
                this.formQuestion.controls["theme"].setValue(
                    question.meta.theme
                );
                this.formQuestion.controls["goal"].setValue(question.meta.goal);
                this.formQuestion.controls["year"].setValue(question.meta.year);
                this.formQuestion.controls["answerType"].setValue(
                    question.meta.answerType
                );
                this.formQuestion.controls["correctAnswer"].setValue(
                    question.meta.correctAnswer
                );
                this.formQuestion.controls["level"].setValue(
                    question.meta.level
                );
                this.formQuestion.controls["habilities"].setValue(
                    question.meta.habilities
                );
                this.formQuestion.controls["descriptors"].setValue(
                    question.meta.descriptors
                );
                this.formQuestion.addControl(
                    "answer_objective",
                    this._formBuilder.array([
                        this.setItem(question.meta.answer_objective[0])
                    ])
                );
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

    updateQuestion() {
        console.log(this.formQuestion.value);
        console.log(this.formQuestion.valid);
        console.log(this.content);
        if (this.formQuestion.valid) {
            this._dailyService
                .update(
                    {
                        meta: this.formQuestion.value,
                        content: this.content
                    },
                    this.formQuestion.get("_id").value
                )
                .then(question => {
                    console.log(question);
                    if (question) {
                        // this._dailyService.currentPlanning.next(planning);
                        this.router.navigate(["/professor/banco-questoes"]);
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
        this.formQuestion.controls["habilities"].setValue(ev);
    }
    descriptoresChanged(ev) {
        console.log(ev);
        this.formQuestion.controls["descriptors"].setValue(ev);
    }
}
