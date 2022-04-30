import {
    Component,
    OnInit,
    ViewEncapsulation,
    OnDestroy,
    Input
} from "@angular/core";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { fuseAnimations } from "@fuse/animations";
import { takeUntil, filter } from "rxjs/operators";
import { Subject } from "rxjs";
import { PlanningsService } from "app/main/plannings/plannings.service";
import { ProfilesService } from "app/services/profiles.service";
import { Profile } from "app/model/profile";
import { QuestionsCenterService } from "./questions-center-service.service";
import { HttpParams } from "@angular/common/http";
import { QuestionsListComponent } from "app/main/questions-database/questions-list/questions-list.component";

@Component({
    selector: "app-questions-center",
    templateUrl: "./questions-center.component.html",
    styleUrls: ["./questions-center.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class QuestionsCenterComponent implements OnInit, OnDestroy {
    @Input() showAnswers = false;
    private list: QuestionsListComponent;

    discipline = 0;
    disciplines: {}[];
    year = 0;
    years: {}[];
    show = "mylibrary";
    // Private
    private _unsubscribeAll: Subject<any>;
    profile: Profile;
    indexTab: number;
    schools: any;
    school = 0;
    count = 0;
    level = 0;
    view = 5;
    page = 1;

    views = [
        { value: 5, viewValue: "5 questões" },
        { value: 10, viewValue: "10 questões" },
        { value: 20, viewValue: "20 questões" },
        { value: 50, viewValue: "50 questões" },
        { value: 100, viewValue: "100 questões" }
    ];
    levels = [
        { value: 0, viewValue: "TODOS" },
        { value: 1, viewValue: "Fácil" },
        { value: 2, viewValue: "Médio" },
        { value: 3, viewValue: "Difícil" }
    ];
    pages = [
        { value: 1, viewValue: "1" },
        { value: 2, viewValue: "2" },
        { value: 3, viewValue: "3" },
        { value: 4, viewValue: "4" },
        { value: 5, viewValue: "5" },
        { value: 6, viewValue: "6" },
        { value: 7, viewValue: "7" },
        { value: 8, viewValue: "8" },
        { value: 9, viewValue: "9" },
        { value: 10, viewValue: "10" }
    ];
    /**
     * Constructor
     *
     * @param {FuseSidebarService} _fuseSidebarService
     */
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _planningsService: PlanningsService,
        private _profileService: ProfilesService,
        private _questionService: QuestionsCenterService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Subscribe to courses
        this._planningsService.onDisciplinesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(disciplines => {
                this.disciplines = [];
                this.disciplines = this.disciplines.concat({
                    id: 0,
                    value: "all",
                    viewValue: "TODAS"
                });
                this.disciplines = this.disciplines.concat(disciplines);
            });
        // Subscribe to courses
        this._planningsService.onYearsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(years => {
                this.years = [];
                this.years = this.years.concat({
                    id: 0,
                    value: "all",
                    viewValue: "TODOS"
                });
                this.years = this.years.concat(years);
            });
        this._profileService._schoolInstitutionalProfiles
            .pipe(
                // filter(profile => profile instanceof Profile),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(schools => {
                this.schools = [];

                this.schools = this.schools.concat({
                    _id: 0,
                    value: "all",
                    name: "TODAS"
                });
                this.schools = this.schools.concat(schools);
            });
        this._profileService
            .currentProfile()
            .pipe(
                filter(profile => profile instanceof Profile),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(profile => {
                this.profile = profile;
                switch (this.profile.$profileType) {
                    case "ProfileCounty":
                        this.indexTab = 1;
                        break;
                    case "ProfileSchool":
                        this.indexTab = 2;
                        break;

                    default:
                        this.indexTab = 3;
                        break;
                }
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

    printDocument() {
        this.list.downloadPDF();
    }

    filter(ev) {
        // console.log(this.school);
        // console.log(this.year);
        // console.log(this.discipline);
        let params = new HttpParams();
        // params = params.set("page", "1");
        params = params.set("page", this.page.toString());
        params = params.set("limit", this.view.toString());
        if (this.school) {
            params = params.set("school", this.school.toString());
        }
        if (this.year) {
            params = params.set("year", this.year.toString());
        }
        if (this.discipline) {
            params = params.set("discipline", this.discipline.toString());
        }
        if (this.level > 0) {
            params = params.set("level", this.level.toString());
        }
        // console.log(params);
        this._questionService.getQuestions(params);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    onScroll() {
        console.log("scroll.....", this.count);
        this.count++;
    }
}
