import { License } from "./../../../interfaces/license";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ProfilesService } from "app/services/profiles.service";
import { PlanningsService } from "app/main/plannings/plannings.service";
import { CookieService } from "ngx-cookie-service";

@Injectable({
    providedIn: "root"
})
export class PlanningDatabaseService {
    // onPlanningChanged: BehaviorSubject<any>;
    onPlanningStepsChanged: BehaviorSubject<any>;
    private readonly _licenses = new BehaviorSubject<License[]>([]);
    private readonly _onPlanningChanged = new BehaviorSubject<any>([]);
    private readonly _onCompareChanged = new BehaviorSubject<any>([]);
    // Expose the observable$ part of the _todos subject (read only stream)
    readonly licenses$ = this._licenses.asObservable();
    readonly planning$ = this._onPlanningChanged.asObservable();
    readonly compare$ = this._onCompareChanged.asObservable();

    private readonly _planningVerions = new BehaviorSubject<any>([]);
    readonly planningVerions$ = this._planningVerions.asObservable();

    private readonly _forkedVerions = new BehaviorSubject<any>([]);
    readonly forkedVerions$ = this._forkedVerions.asObservable();

    private readonly _otherVersions = new BehaviorSubject<any>([]);
    readonly otherVersions$ = this._otherVersions.asObservable();

    private readonly _planningSuggestions = new BehaviorSubject<any>([]);
    readonly planningSuggestions$ = this._planningSuggestions.asObservable();
    cookieCurrentProfile: any;
    constructor(
        private _httpClient: HttpClient,
        private _profileService: ProfilesService,
        private _planningsService: PlanningsService,
        private _cookieService: CookieService
    ) {
        // Set the defaults
        this.onPlanningStepsChanged = new BehaviorSubject({});
        let hasCookieCurrentProfile = this._cookieService.check(
            "atla.currentProfile"
        );
        if (hasCookieCurrentProfile) {
            this.cookieCurrentProfile = JSON.parse(
                this._cookieService.get("atla.currentProfile")
            );
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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
                this.getCCLicenses(),
                this.getPlanning(
                    route.params.id,
                    route.params.version,
                    route.queryParams
                ),
                this.getPlanningVersions(route.params.id),
                this.getPlanningSteps(route.url[0].path, route.params.stepSlug)
            ]).then(([]) => {
                resolve();
            }, reject);
        });
    }

    pullPlanning(planning: any, why: string) {
        console.log(planning);
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(`/api/documents/lesson/pull`, {
                    pulled: planning.meta.forked._id,
                    pulling: planning._id,
                    pullingVersion: planning.documentVersion,
                    why,
                    from: planning.owner
                })
                .subscribe(
                    res => {
                        console.log(res);
                        resolve(res);
                    },
                    err => {
                        console.log(err);
                        reject(err);
                    }
                );
        });
    }

    denySuggestion(_id: any) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(`/api/documents/lesson/pull-deny/${_id}`, {})
                .subscribe(
                    res => {
                        console.log(res);
                        resolve(res);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }
    acceptSuggestion(_id: any) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(`/api/documents/lesson/pull-accept/${_id}`, {})
                .subscribe(
                    res => {
                        console.log(res);
                        resolve(res);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }

    deleteSuggestion(_id: any) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .delete(`/api/documents/lesson/pull/${_id}`, {})
                .subscribe(
                    res => {
                        console.log(res);
                        resolve(res);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }

    forkPlanning(planning: any) {
        console.log(planning);
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(`/api/documents/lesson/fork`, {
                    _id: planning,
                    profile: this._profileService._currentProfile.value.id,
                    version: planning.documentVersion
                })
                .subscribe(
                    res => {
                        console.log(res);
                        resolve(res);
                    },
                    err => {
                        console.log(err);
                        reject(err);
                    }
                );
        });
    }

    getPlanning(id, version?, params?) {
        if (id) {
            return new Promise((resolve, reject) => {
                this._httpClient
                    .get(
                        `/api/profile/professor/planning/v2/daily/${id}/${version}`,
                        { params: params }
                    )
                    .subscribe(
                        res => {
                            console.log(res);
                            this._onPlanningChanged.next(res["data"]);
                            this._onCompareChanged.next(res["compare"]);
                            resolve(res);
                        },
                        err => {
                            reject(err);
                        }
                    );
            });
        }
    }
    getSuggestion(id, version?, params?) {
        if (id) {
            return new Promise((resolve, reject) => {
                this._httpClient
                    .get(
                        `/api/profile/professor/planning/v2/daily/${id}/${version}`,
                        { params: params }
                    )
                    .subscribe(
                        res => {
                            console.log(res);
                            this._onCompareChanged.next(res["data"]);
                            resolve(res);
                        },
                        err => {
                            reject(err);
                        }
                    );
            });
        }
    }

    getPlanningVersions(id) {
        if (id) {
            return new Promise((resolve, reject) => {
                this._httpClient
                    .get(
                        `/api/profile/professor/${this.cookieCurrentProfile[id]}/planning/v2/daily/${id}/versions`
                    )
                    .subscribe(
                        res => {
                            console.log(res);
                            this._planningSuggestions.next(
                                res["data"]["suggestions"]
                            );
                            this._planningVerions.next(res["data"]["versions"]);
                            this._forkedVerions.next(
                                res["data"]["forkedVersions"]
                            );
                            this._otherVersions.next(
                                res["data"]["otherVersions"]
                            );
                            resolve(res);
                        },
                        err => {
                            reject(err);
                        }
                    );
            });
        }
    }

    getPlanningSteps(path, stepSlug): Promise<any> {
        // console.log(stepSlug);
        return new Promise((resolve, reject) => {
            this._httpClient
                .get("api/planning-database/" + path + "/" + stepSlug)
                .subscribe((response: any) => {
                    // console.log(response);
                    this.onPlanningStepsChanged.next(response);
                    resolve(response);
                }, reject);
        });
    }

    getCCLicenses(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get<License[]>("api/cc-licenses")
                .subscribe((response: any) => {
                    this._licenses.next(response);
                    resolve(response);
                }, reject);
        });
    }

    deletePlanning(_id: any) {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(`/api/documents/lesson/${_id}`).subscribe(
                res => {
                    console.log(res);
                    resolve(res);
                },
                err => {
                    reject(err);
                }
            );
        });
    }

    get planning() {
        return this._onPlanningChanged.getValue();
    }

    get compare() {
        return this._onCompareChanged.getValue();
    }

    get forkedVerions() {
        return this._forkedVerions.getValue();
    }
    get otherVersions() {
        return this._otherVersions.getValue();
    }

    get licenses(): License[] {
        return this._licenses.getValue();
    }
}
