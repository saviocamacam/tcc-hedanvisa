import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Profile } from "app/model/profile";
import { AuthService } from "../../services/authentication.service";

@Injectable({
    providedIn: "root"
})
export class AuthorizationService {
    onFilterChanged: BehaviorSubject<any>;
    onSearchTextChanged: BehaviorSubject<any>;
    searchText: string;

    currentProfile: Profile;

    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService
    ) {
        console.log("Hello World AuthorizationService");
        this.onFilterChanged = new BehaviorSubject("");
        this.onSearchTextChanged = new BehaviorSubject("");
    }

    getSchoolProfessorsRequestings(idSchool): any {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(`/api/profile/school-institutional/${idSchool}/professors`)
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

    getSchoolManagersRequestings(idCounty): any {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(
                    `/api/profile/county-institutional/${idCounty}/schools/school-managers`
                )
                .subscribe(
                    res => {
                        const managers = res["data"];
                        console.log(managers);
                        managers.sort((a, b) => {
                            if (a.requesting && b.requesting) {
                                if (
                                    a.requesting.user.shortName >
                                    b.requesting.user.shortName
                                ) {
                                    return 1;
                                }
                                if (
                                    a.requesting.user.shortName <
                                    b.requesting.user.shortName
                                ) {
                                    return -1;
                                }
                            }

                            return 0;
                        });
                        resolve(managers);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }

    changeStatus(action: any, id: string): any {
        return new Promise((resolve, reject) => {
            this._httpClient
                .put(`/api/link/${id}`, { status: action })
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
