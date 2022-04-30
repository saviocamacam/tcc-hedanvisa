import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class EnrollmentsCenterService {
    constructor() {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
                // this.getQuestionsSteps(
                //     route.url[0].path,
                //     route.params.stepSlug
                // ),
                // this._planningsService.getDisciplines(),
                // this._planningsService.getYears()
            ]).then(() => {
                resolve();
            }, reject);
        });
    }
}
