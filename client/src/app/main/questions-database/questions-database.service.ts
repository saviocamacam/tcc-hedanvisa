import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { PlanningsService } from "app/main/plannings/plannings.service";
import { ProfilesService } from "app/services/profiles.service";

@Injectable({
    providedIn: "root"
})
export class QuestionsDatabaseService {
    onQuestionChanged: BehaviorSubject<any>;
    onQuestionsStepsChanged: BehaviorSubject<any>;

    constructor(
        private _httpClient: HttpClient,
        private _planningsService: PlanningsService,
        private _profileService: ProfilesService
    ) {
        // Set the defaults

        this.onQuestionChanged = new BehaviorSubject({});
        this.onQuestionsStepsChanged = new BehaviorSubject({});
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
                this.getQuestion(route.params.id),
                this.getQuestionsSteps(
                    route.url[0].path,
                    route.params.stepSlug
                ),
                this._planningsService.getDisciplines(),
                this._planningsService.getYears()
            ]).then(() => {
                resolve();
            }, reject);
        });
    }
    getQuestion(id: any): any {
        if (id) {
            return new Promise((resolve, reject) => {
                this._httpClient.get(`/api/document/Question/${id}`).subscribe(
                    res => {
                        console.log(res);
                        this.onQuestionChanged.next(res["data"]);
                        resolve(res["data"]);
                    },
                    err => {
                        console.log(err);
                        reject(err);
                    }
                );
            });
        }
    }
    deleteQuestion(id: any): any {
        if (id) {
            return new Promise((resolve, reject) => {
                this._httpClient
                    .delete(
                        `/api/profile/professor/${
                            this._profileService._currentProfile.value.id
                        }/question/${id}`
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
    }

    getQuestionsSteps(path, stepSlug): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get("api/question-database/" + path + "/" + stepSlug)
                .subscribe((response: any) => {
                    // console.log(response);
                    this.onQuestionsStepsChanged.next(response);
                    resolve(response);
                }, reject);
        });
    }
}
