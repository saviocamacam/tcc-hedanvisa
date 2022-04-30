import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ProfilesService } from "app/services/profiles.service";
import { PlanningsService } from "app/main/plannings/plannings.service";
import { Profile } from "app/model/profile";
import { filter } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class QuestionsCenterService {
    onQuestionsChanged: BehaviorSubject<any>;

    profile: any;
    showAnswers = false;

    constructor(
        private _httpClient: HttpClient,
        private _profileService: ProfilesService,
        private _planningsService: PlanningsService
    ) {
        this.onQuestionsChanged = new BehaviorSubject({});

        this._profileService
            .currentProfile()
            .pipe(filter(profile => profile instanceof Profile))
            .subscribe(profile => {
                console.log(profile);
                this.profile = profile;
            });
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
            if (this.profile.$profileType === "ProfileCounty") {
                let params = new HttpParams();
                params = params.set("page", "1");
                params = params.set("limit", "5");
                Promise.all([
                    this._profileService.getSchoolsByCounty(
                        this.profile.county.requested._id
                    ),
                    this._planningsService.getDisciplines(),
                    this._planningsService.getYears(),
                    this.getQuestions(params),
                    this.getQuentionsCount()
                ]).then(() => {
                    resolve();
                }, reject);
            } else {
                Promise.all([
                    this._planningsService.getDisciplines(),
                    this._planningsService.getYears(),
                    this.getQuestions(new HttpParams())
                ]).then(() => {
                    resolve();
                }, reject);
            }
        });
    }

    getQuentionsCount(owner?): any {
        return new Promise((resolve, reject) => {
            if (this.profile.$profileType === "ProfileCounty" && !owner) {
                this._httpClient
                    .get(
                        `/api/profile/county-institutional/${
                            this.profile.county.requested._id
                        }/document/Question`
                    )
                    .subscribe(
                        res => {
                            console.log(res);
                            if (res["data"]) {
                                this.onQuestionsChanged.next(res["data"]);
                            } else {
                                this.onQuestionsChanged.next([]);
                            }
                            resolve(res);
                        },
                        err => {
                            reject(err);
                        }
                    );
            }
        });
    }

    getQuestions(params: HttpParams, owner?): any {
        if (this.profile.$profileType === "ProfileProfessor") {
            return new Promise((resolve, reject) => {
                this._httpClient
                    .get(
                        `/api/profile/professor/${
                            this.profile.id
                        }/document/Question`
                    )
                    .subscribe(
                        res => {
                            console.log(res);
                            if (res["data"]) {
                                this.onQuestionsChanged.next(
                                    res["data"]["documents"]
                                );
                            } else {
                                this.onQuestionsChanged.next(new Array());
                            }
                            resolve(res);
                        },
                        err => {
                            reject(err);
                        }
                    );
            });
        } else if (this.profile.$profileType === "ProfileCounty" && !owner) {
            return new Promise((resolve, reject) => {
                this._httpClient
                    .get(
                        `/api/profile/county-institutional/${
                            this.profile.county.requested._id
                        }/document/Question`,
                        {
                            params: params
                        }
                    )
                    .subscribe(
                        res => {
                            console.log(res);
                            if (res["data"]) {
                                this.onQuestionsChanged.next(
                                    res["data"]["docs"]
                                );
                            } else {
                                this.onQuestionsChanged.next([]);
                            }
                            resolve(res);
                        },
                        err => {
                            reject(err);
                        }
                    );
            });
        } else if (this.profile.$profileType === "ProfileSchool" && !owner) {
            return new Promise((resolve, reject) => {
                this._httpClient
                    .get(
                        `/api/profile/school-institutional/${
                            this.profile.school.requested._id
                        }/document/Question`,
                        {
                            params: params
                        }
                    )
                    .subscribe(
                        res => {
                            console.log(res["data"]);
                            if (res["data"]) {
                                this.onQuestionsChanged.next(res["data"]);
                            } else {
                                this.onQuestionsChanged.next([]);
                            }
                            resolve(res);
                        },
                        err => {
                            reject(err);
                        }
                    );
            });
        } else if (this.profile.$profileType === "ProfileSchool" && owner) {
            return new Promise((resolve, reject) => {
                this._httpClient
                    .get(
                        `/api/profile/school/${
                            this.profile.school.requested._id
                        }/document/Question`
                    )
                    .subscribe(
                        res => {
                            console.log(res["data"]);
                            if (res["data"]) {
                                this.onQuestionsChanged.next(res["data"]);
                            } else {
                                this.onQuestionsChanged.next([]);
                            }
                            resolve(res);
                        },
                        err => {
                            reject(err);
                        }
                    );
            });
        }
    }

    save(data) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(
                    `/api/profile/professor/${
                        this._profileService._currentProfile.value.id
                    }/question`,
                    data
                )
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }
}
