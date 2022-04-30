import { Injectable } from "@angular/core";
import { AuthService } from "../../services/authentication.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ClassroomService } from "app/main/classroom/classroom.service";

@Injectable({
    providedIn: "root"
})
export class FrequencyService {
    onSearchTextChanged: BehaviorSubject<any>;
    _frequenciesList: BehaviorSubject<any>;

    constructor(
        private _authService: AuthService,
        private _classroomService: ClassroomService,
        private _httpClient: HttpClient
    ) {
        console.log("Hello World ClassroomService");

        this.onSearchTextChanged = new BehaviorSubject("");
        this._frequenciesList = new BehaviorSubject(null);
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
                this.getClassroomFrequencies(route.params.classroomId),
                this._classroomService.getEnrollments(route.params.classroomId)
            ]).then(() => {
                resolve();
            }, reject);
        });
    }

    getClassroomFrequencies(_id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`/api/classroom/${_id}/frequency`).subscribe(
                res => {
                    console.log(`Returning: ${res["data"].length} Frequencies`);
                    this._frequenciesList.next(res["data"]);
                    resolve(res["data"]);
                },
                error => reject(error)
            );
        });
    }

    getClassroomFrequenciesPage(
        _id: any,
        page: number,
        limit: number,
        order: string,
        orderBy: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            let params = new HttpParams()
                .set("page", page.toString())
                .set("limit", limit.toString())
                .set("order", order.toString())
                .set("orderBy", orderBy);

            this._httpClient
                .get(`/api/classroom/${_id}/frequency/search`, { params })
                .subscribe(
                    res => {
                        console.log(
                            `Returning: ${res["data"].length} Frequencies, ${page} page, ${res["length"]} length`
                        );
                        this._frequenciesList.next(res["data"]);
                        resolve({
                            frequencies: res["data"],
                            length: res["length"]
                        });
                    },
                    error => reject(error)
                );
        });
    }

    getClassroomFrequenciesPageFilterPeriod(
        _id: any,
        page: number,
        limit: number,
        order: string,
        orderBy: string,
        begin: string,
        end: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            let params = new HttpParams()
                .set("page", page.toString())
                .set("limit", limit.toString())
                .set("order", order)
                .set("orderBy", orderBy)
                .set("begin", begin.slice(0, 10))
                .set("end", end.slice(0, 10));

            this._httpClient
                .get(`/api/classroom/${_id}/frequency-period`, { params })
                .subscribe(
                    res => {
                        console.log(res);
                        console.log(
                            `Returning: ${res["data"].length} Frequencies, ${page} page, ${res["length"]} length`
                        );
                        this._frequenciesList.next(res["data"]);
                        resolve({
                            frequencies: res["data"],
                            length: res["length"]
                        });
                    },
                    error => reject(error)
                );
        });
    }

    deleteFrequency(frequencyId: any): any {
        return new Promise((resolve, reject) => {
            this._httpClient
                .delete(`/api/frequency/${frequencyId}`)
                .subscribe(res => resolve(res["data"]), err => reject(err));
        });
    }

    setFrequency(value: any, idClassroom: any): Promise<any> {
        console.log(value);
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(`/api/classroom/${idClassroom}/frequency`, value)
                .subscribe(res => resolve(res["data"]), err => reject(err));
        });
    }

    setFrequency2(value: any, idClassroom: any): Promise<any> {
        console.log(value);
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(`/api/classroom/${idClassroom}/frequency2`, value)
                .subscribe(res => resolve(res["data"]), err => reject(err));
        });
    }

    updateFrequency(value: any, frequencyId: any): Promise<any> {
        console.log(value);
        return new Promise((resolve, reject) => {
            this._httpClient
                .put(`/api/frequency/${frequencyId}`, value)
                .subscribe(res => resolve(res["data"]), err => reject(err));
        });
    }

    getMatrixes(classroomId: string, periodId: string): Promise<any> {
        const params = new HttpParams()
            .set("classroom", classroomId)
            .set("period", periodId);
        return new Promise((resolve, reject) => {
            this._httpClient
                .get("api/matrix", { params: params })
                .subscribe(response => resolve(response), err => reject(err));
        });
    }

    getEnrollmentValuation(valuationId: any): any {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(`api/valuation/enrollmentValuation/${valuationId}`)
                .subscribe(response => resolve(response), err => reject(err));
        });
    }
}
