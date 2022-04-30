import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { ProfilesService } from "app/services/profiles.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { PlanningsService } from "../plannings.service";

@Component({
    selector: "app-bncc",
    templateUrl: "./bncc.component.html",
    styleUrls: ["./bncc.component.scss"]
})
export class BnccComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;
    subjects: any;
    years: any;
    habilities: any;
    currentHability: any;

    year: any;
    subject: any;

    constructor(
        private _planningsService: PlanningsService,
        private _profilesService: ProfilesService,
        private _fuseSidebarService: FuseSidebarService
    ) {
        console.log("Hello World SharedPlanningBnccComponent");

        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.subjects = this._profilesService.getSubjectsFake();
        this.subject = this.subjects[0].viewValue;
        this.years = this._profilesService.getCourseYearsFundamental();
        this.year = this.years[0].viewValue;
        this.getHabilities();
    }

    ngOnDestroy() {
        console.log("SharedPlanningBnccComponent destroyed");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    yearChanged(ev) {
        this.getHabilities();
    }
    subjectChanged(ev) {
        this.getHabilities();
    }

    getHabilities() {
        console.log(this.year);
        console.log(this.subject);
        this._planningsService
            .getHabilities(this.year, this.subject)
            .then(res => {
                this.habilities = res["habilities"];
            })
            .catch(err => {
                console.log(err);
            });
    }

    habilityDetail(hability) {
        this.currentHability = hability;
    }

    toggleSidebar(content): void {
        this._fuseSidebarService.getSidebar(content).toggleOpen();
    }
}
