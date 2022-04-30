import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { PlanningsService } from "app/main/plannings/plannings.service";
import { PlanningDatabaseService } from "app/main/plannings/planning-database/planning-database.service";
import { ProfilesService } from "app/services/profiles.service";

@Injectable({
    providedIn: "root"
})
export class PlanningCenterService {
    onDisciplineFilterChanged: BehaviorSubject<any>;

    onYearFilterChanged: BehaviorSubject<any>;
    _documents: BehaviorSubject<any[]> = new BehaviorSubject<any>([]);
    constructor(
        private _httpClient: HttpClient,
        private _planningsService: PlanningsService,
        private _planningDatabaseService: PlanningDatabaseService,
        private _profileService: ProfilesService
    ) {
        this.onDisciplineFilterChanged = new BehaviorSubject({});
        this.onYearFilterChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
                this._planningsService.getDisciplines(),
                this._planningsService.getYears(),
                this._planningDatabaseService.getCCLicenses(),
                this.get()
            ]).then(() => {
                resolve();
            }, reject);
        });
    }

    get() {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(
                    `/api/profile/professor/${this._profileService._currentProfile.value.id}/planning/v2/daily`
                )
                .subscribe(
                    res => {
                        console.log(res);
                        if (res["data"]) {
                            this._documents.next(res["data"]);
                        } else {
                            this._documents.next([]);
                        }
                        resolve(res);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }

    getBySchool() {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(
                    `/api/documents/lesson/by-school-unit/${this._profileService._currentProfile.value.school.requested._id}`
                )
                .subscribe(
                    res => {
                        console.log(res);
                        if (res["data"]) {
                            this._documents.next(res["data"]);
                        }
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }
}
