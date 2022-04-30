import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProfilesService } from "app/services/profiles.service";
import { Subject } from "rxjs";
import { Profile } from "app/model/profile";
import { filter, takeUntil } from "rxjs/operators";
import { MatDialog } from "@angular/material";
import { CountyPlanningsService } from "../../county-plannings.service";
import { DocumentsService } from "app/main/documents/documents.service";
import { CountySchoolsService } from "../../../county-schools/county-schools.service";
import { AttentionAlertDialogComponent } from "app/main/alerts/attention/attention.component";

@Component({
    selector: "app-county-annual-planning-sidebar",
    templateUrl: "./county-annual-planning-sidebar.component.html",
    styleUrls: ["./county-annual-planning-sidebar.component.scss"]
})
export class CountyAnnualPlanningSidebarComponent implements OnInit, OnDestroy {
    courses: any[];
    course: any;
    years: any[];
    year: any;

    currentFile: any;
    hasFile = false;

    schoolYears: any[];
    currentAnnualPlanning: any;

    profile: Profile;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _profilesService: ProfilesService,
        private _countySchoolsService: CountySchoolsService,
        private _countyPlanningsService: CountyPlanningsService,
        private _matDialog: MatDialog,
        private _documentsService: DocumentsService
    ) {
        console.log("Hello World CountyAnnualPlanningSidebarComponent");

        this._unsubscribeAll = new Subject<any>();
    }

    ngOnInit() {
        this._profilesService
            .currentProfile()
            .pipe(
                filter(profile => profile instanceof Profile),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(
                profile => {
                    this.profile = profile;
                },
                error => {
                    console.log(error);
                }
            );

        this.courses = this._profilesService.getCourseLevels();

        this._countySchoolsService
            .schoolYearList()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                schoolYears => {
                    if (schoolYears) {
                        this.schoolYears = schoolYears;
                        console.log(this.schoolYears);

                        if (!this.currentAnnualPlanning) {
                            this.schoolYearDetail(this.schoolYears[0]);
                        }
                    }
                },
                error => console.log(error)
            );

        this._countyPlanningsService
            .currentAnnualPlanning()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                currentAnnualPlanning => {
                    if (currentAnnualPlanning) {
                        this.currentAnnualPlanning = currentAnnualPlanning;
                        console.log(this.currentAnnualPlanning);
                        if (this.currentAnnualPlanning.attachments.length > 0) {
                            this.currentFile = this.currentAnnualPlanning.attachments[0].content;
                        } else {
                            this.currentFile = null;
                        }
                    }
                },
                error => {
                    console.log(error);
                }
            );
    }

    ngOnDestroy(): void {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    courseChanged(course) {
        this.course = course;
        if (course === "f1") {
            this.years = this._profilesService.changeYearsRange(1, 5);
        } else if (course === "f2") {
            this.years = this._profilesService.changeYearsRange(6, 9);
        } else if (course === "medio") {
            this.years = this._profilesService.changeYearsRange(1, 3);
        } else if (course === "superior") {
            this.years = this._profilesService.changeYearsRange(1, 7);
        } else if (course === "eja") {
            this.years = this._profilesService.changeYearsRange(1, 9);
        }
    }

    yearChanged(year) {
        this.year = year;
    }

    async schoolYearDetail(schoolYear) {
        if (
            this.profile.$profileType !== "ProfileCounty" &&
            schoolYear.attachments.length === 0
        ) {
            setTimeout(() => {
                this._matDialog.open(AttentionAlertDialogComponent, {
                    width: "400px",
                    data: {
                        justification: `Nenhum documento de Planejamento Anual foi adicionado a este calendário até o momento. 
                                            Aguarde o Gestor de Rede submeter, ou contate-o.`
                    }
                });
            });
        }

        this.currentAnnualPlanning = await schoolYear;

        await this._countyPlanningsService._currentAnnualPlanning.next(
            this.currentAnnualPlanning
        );

        if (this.currentAnnualPlanning.attachments.length > 0) {
            this.currentFile = await this.currentAnnualPlanning.attachments[0]
                .content;
        } else {
            this.currentFile = await null;
        }
        await this._documentsService._currentFile.next(this.currentFile);
        await this._documentsService.renderFile(this.currentFile);
    }
}
