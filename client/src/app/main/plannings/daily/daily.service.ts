import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { ProfilesService } from "app/services/profiles.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

@Injectable({
    providedIn: "root"
})
export class DailyService {
    currentDaily: any;

    _attachments: BehaviorSubject<any[]> = new BehaviorSubject<any>([]);
    _documents: BehaviorSubject<any[]> = new BehaviorSubject<any>([]);
    theme: BehaviorSubject<any> = new BehaviorSubject<any>({});
    currentPlanning: BehaviorSubject<any> = new BehaviorSubject<any>({});
    constructor(
        private _httpClient: HttpClient,
        private _profileService: ProfilesService
    ) {
        console.log("Hello World Planning");
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
            Promise.all([this.get()]).then(() => {
                resolve();
            }, reject);
        });
    }

    attachmentsList(): Observable<any> {
        return this._attachments.asObservable();
    }

    save(data) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(
                    `/api/profile/professor/${this._profileService._currentProfile.value.id}/planning/daily`,
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

    update(data, id): any {
        console.log(data);
        console.log(id);
        return new Promise((resolve, reject) => {
            this._httpClient
                .put(
                    `/api/profile/professor/${this._profileService._currentProfile.value.id}/document/${id}`,
                    data
                )
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

    getAttachments(): Promise<any> {
        this.currentPlanning.subscribe(planning => {
            this.currentDaily = planning._id;
        });
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(
                    `/api/profile/professor/planning/${this.currentDaily}/attachments`
                )
                .subscribe(
                    res => {
                        this._attachments.next(res["data"].attachments);
                        resolve(res["success"]);
                    },
                    error => {
                        reject(error);
                    }
                );
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
                        }
                        resolve(res);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }

    getByTheme(theme) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(
                    `/api/profile/professor/${this._profileService._currentProfile.value.id}/planning/daily?theme=${theme}`
                )
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
}
