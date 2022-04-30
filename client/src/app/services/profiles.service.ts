import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import fakeProfiles from "../fake-db/profiles";
import subjectsEf from "../fake-db/subjects";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { Profile } from "../model/profile";
import { AuthService } from "app/services/authentication.service";

@Injectable({
    providedIn: "root"
})
export class ProfilesService {
    subjectsEf;

    profiles: any[];
    fakeProfiles: any;
    _profilesOptions: BehaviorSubject<Profile[]>;
    _currentProfile: BehaviorSubject<any>;

    _profilesListChange: Subject<any>;
    _schoolInstitutionalProfiles: Subject<any>;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService
    ) {
        this._profilesOptions = new BehaviorSubject(null);
        this._currentProfile = new BehaviorSubject(null);
        this._schoolInstitutionalProfiles = new BehaviorSubject(null);

        this._profilesListChange = new Subject();

        this.fakeProfiles = fakeProfiles;
        this.subjectsEf = subjectsEf;
    }

    profilesOptions(): Observable<Profile[]> {
        return this._profilesOptions.asObservable();
    }

    currentProfile(): Observable<any> {
        return this._currentProfile.asObservable();
    }

    /**
     * Get profiles
     *
     */
    getAllProfiles(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get("/api/user/profiles").subscribe(
                response => {
                    this._profilesOptions.next(response["data"].profiles);
                    resolve(response["data"].profiles);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    getProfile(profileId: string) {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`/api/profile/${profileId}`).subscribe(
                response => {
                    // console.log(response);
                    resolve(response["data"]["profile"]);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    getOneProfile(profileType: string, profileId: string) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(`/api/profile/${profileType}/${profileId}`)
                .subscribe(
                    response => {
                        resolve(response["data"].profile);
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }

    createProfile(profileType, profile) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(`/api/profile/${profileType}`, profile)
                .subscribe(
                    async response => {
                        await this.getAllProfiles();
                        await this._authService.updateToken();
                        await this._profilesListChange.next();

                        await resolve(response["data"]["profile"]);
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }

    updateProfile(profileType, profile) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .put(`/api/profile/${profileType}`, profile)
                .subscribe(
                    response => {
                        resolve(response["data"]["profile"]);
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }

    disableProfile(profile) {
        console.log("disable profile method");
    }

    getSubjectsFake() {
        return this.subjectsEf.subjectsEf;
    }

    getSchool(_id: string) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(`/api/profile/school-institutional/${_id}`)
                .subscribe(
                    response => {
                        resolve(response);
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }

    getSchoolsProfiles(): any {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`/api/profile/school-institutional`).subscribe(
                res => {
                    const schools = res["data"]["schools"];
                    schools.sort((a, b) => {
                        if (a.institution.name > b.institution.name) {
                            return 1;
                        }
                        if (a.institution.name < b.institution.name) {
                            return -1;
                        }
                        return 0;
                    });
                    resolve(schools);
                },
                err => {
                    reject(err);
                }
            );
        });
    }

    getSchoolsByCounty(county_id: any) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(
                    `/api/profile/school-institutional?countyInstitutional=${county_id}`
                )
                .subscribe(
                    res => {
                        const schools = res["data"]["schools"];
                        schools.sort((a, b) => {
                            if (a.institution.name > b.institution.name) {
                                return 1;
                            }
                            if (a.institution.name < b.institution.name) {
                                return -1;
                            }
                            // a must be equal to b
                            return 0;
                        });
                        this._schoolInstitutionalProfiles.next(schools);
                        resolve(schools);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }

    getSchoolRoles(): any {
        return this.fakeProfiles.schoolRoles;
    }

    getKinships(): any {
        return this.fakeProfiles.kinships;
    }

    getVoluntaries(): any {
        return this.fakeProfiles.voluntaries;
    }

    getStates() {
        return this._httpClient.get(`api/states`);
    }

    getCountyByState(stateId) {
        return this._httpClient.get(
            `api/profile/county-institutional?state_id=${stateId}`
        );
    }

    getCountyRoles(): any {
        return this.fakeProfiles.countyRoles;
    }

    getInstitutionByCounty(countyId) {
        return this._httpClient.get(
            `api/profile/school-institutional?countyInstitutional=${countyId}`
        );
    }

    changeYearsRange(v1, v2) {
        return this.fakeProfiles.courseYears.filter(v => {
            return Number(v.value) >= v1 && Number(v.value) <= v2;
        });
    }

    getCourseLevels(): any {
        return this.fakeProfiles.courseLevels;
    }

    getCourseLevelsExcept(arg0: any): any {
        return this.fakeProfiles.courseLevels.filter(v => {
            return v.value !== arg0;
        });
    }

    getCourseYearsFundamental() {
        return fakeProfiles.courseYears;
    }

    getProfileByContact(profileType, contact: string) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(`/profile/${profileType}/contact?address=${contact}`)
                .subscribe(
                    res => {
                        resolve(res["data"]);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }
}
