import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../../services/authentication.service";
import { BehaviorSubject, Observable } from "rxjs";
import profiles from "../../fake-db/profiles";
import { ProfilesService } from "../../services/profiles.service";

@Injectable({
    providedIn: "root"
})
export class SchoolService {
    haveSchoolYearsUpdated: BehaviorSubject<Boolean>;

    _filterBy: BehaviorSubject<any>;

    _currentSchoolYear: BehaviorSubject<any>;
    _schoolYearList: BehaviorSubject<any>;

    onSearchTextChanged: BehaviorSubject<any>;
    private currentSchoolInstitutional: BehaviorSubject<any>;

    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService,
        private _profilesService: ProfilesService
    ) {
        console.log("Hello World SchoolsService");

        this.onSearchTextChanged = new BehaviorSubject("");

        this.haveSchoolYearsUpdated = new BehaviorSubject(false);
        this.currentSchoolInstitutional = new BehaviorSubject(null);

        this._currentSchoolYear = new BehaviorSubject(null);
        this._schoolYearList = new BehaviorSubject(null);
        this._filterBy = new BehaviorSubject("schools");

        this._profilesService.currentProfile().subscribe(
            profile => {
                if (profile) {
                    if (profile.profileType === "ProfileCounty") {
                        this.getSchoolYearByCounty(profile.role.county);
                    } else {
                        this.getSchoolYearByCounty(
                            profile.school.requested.countyInstitutional._id
                        );
                    }
                }
            },
            error => console.log(error)
        );
    }

    get $currentSchoolInstituional(): Observable<any> {
        return this.currentSchoolInstitutional.asObservable();
    }

    set $currentSchoolInstituional(school) {
        console.log(school);
        this.currentSchoolInstitutional.next(school);
    }

    currentSchoolYear(): Observable<any> {
        return this._currentSchoolYear.asObservable();
    }

    schoolYearList(): Observable<any> {
        return this._schoolYearList.asObservable();
    }

    filterBy(): Observable<any> {
        return this._filterBy.asObservable();
    }

    getSchoolsByCounty(county_id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(
                    `/api/profile/school-institutional?countyInstitutional=${county_id}`
                )
                .subscribe(
                    res => {
                        resolve(res["data"].schools);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }

    savePeriod(form: any): any {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`/api/period`, form).subscribe(
                res => {
                    this.haveSchoolYearsUpdated.next(res["success"]);
                    this.getSchoolYearDetail(res["data"]["schoolYear"]);
                    resolve(res["data"]);
                },
                err => {
                    reject(err);
                }
            );
        });
    }

    updateSchoolYear(id: any, value: any): any {
        return new Promise((resolve, reject) => {
            this._httpClient.put(`/api/school-year/${id}`, value).subscribe(
                res => {
                    console.log(res);
                    this.haveSchoolYearsUpdated.next(res["success"]);
                    resolve(res["data"]);
                },
                err => {
                    reject(err);
                }
            );
        });
    }

    createSchoolYear(value: any): any {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`/api/school-year`, value).subscribe(
                res => {
                    console.log(res);
                    this.haveSchoolYearsUpdated.next(res["success"]);
                    this._currentSchoolYear.next(res["data"]);
                    resolve(res["data"]);
                },
                err => {
                    reject(err);
                }
            );
        });
    }

    getSchoolYearByCounty(_id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`/api/school-year?county=${_id}`).subscribe(
                res => {
                    if (res["data"]["regime"]) {
                        res["data"]["regime"] = profiles.periods.find(
                            el => el.value === res["data"]["regime"]
                        );
                    }
                    this._schoolYearList.next(res["data"]);
                    resolve(res["data"]);
                },
                err => {
                    console.log(err);
                    reject(err);
                }
            );
        });
    }

    getSchoolYearDetail(schoolYearId: any): any {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`/api/school-year/${schoolYearId}`).subscribe(
                res => {
                    console.log(res);
                    if (res["data"]["regime"]) {
                        res["data"]["regime"] = profiles.periods.find(
                            el => el.value === res["data"]["regime"]
                        );
                    }
                    this._currentSchoolYear.next(res["data"]);
                    resolve(res["data"]);
                },
                err => {
                    console.log(err);
                    reject(err);
                }
            );
        });
    }

    getCurrentSchoolYearBySchool(schoolId): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get("/api/school-institutional/current-school-year")
                .subscribe(
                    res => {
                        resolve(res["data"].currentSchoolYear);
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }
}
