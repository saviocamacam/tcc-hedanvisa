import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "app/services/authentication.service";
import { BehaviorSubject, Observable } from "rxjs";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

@Injectable({
    providedIn: "root"
})
export class PlanningsService {
    onDisciplinesChanged = new BehaviorSubject<any>([]);
    onYearsChanged = new BehaviorSubject<any>([]);
    _currentAnnualPlanning: BehaviorSubject<any>;

    readonly years$ = this.onYearsChanged.asObservable();
    readonly disciplines$ = this.onDisciplinesChanged.asObservable();

    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService
    ) {
        console.log("Hello World SharedPlanningsService");
        this._currentAnnualPlanning = new BehaviorSubject(null);
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
        console.log(route);
        return new Promise((resolve, reject) => {
            Promise.all([this.getDisciplines(), this.getYears()]).then(() => {
                resolve();
            }, reject);
        });
    }

    currentAnnualPlanning(): Observable<any> {
        return this._currentAnnualPlanning.asObservable();
    }

    /**
     * Get disciplines
     *
     * @returns {Promise<any>}
     */
    getDisciplines(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get("api/disciplines")
                .subscribe((response: any) => {
                    this.onDisciplinesChanged.next(response);
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get years
     *
     * @returns {Promise<any>}
     */
    getYears(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get("api/years").subscribe((response: any) => {
                this.onYearsChanged.next(response);
                resolve(response);
            }, reject);
        });
    }

    getHabilities(year: any, subject: any): any {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(
                    `/api/competence/hability?ano=${year}&componente=${subject}`
                )
                .subscribe(
                    res => {
                        console.log(res);
                        resolve(res["data"]);
                    },
                    err => {
                        console.error(err);
                        reject(err);
                    }
                );
        });
    }

    uploadSchoolYearAttachment(file: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post("/api/file/uploadSchoolYearAttachment", file)
                .subscribe(
                    response => {
                        resolve(response["data"].file);
                    },
                    error => {
                        console.log("service error");
                        console.log(error);
                        reject(error);
                    }
                );
        });
    }

    editSchoolYearDocument(_id: any, schoolYear: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .put(`/api/school-year/${_id}/add_attachments`, schoolYear)
                .subscribe(
                    response => {
                        resolve(response["data"].year);
                    },
                    error => {
                        console.log("service error");
                        console.log(error);
                        reject(error);
                    }
                );
        });
    }
}
