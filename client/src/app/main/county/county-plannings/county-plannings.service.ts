import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "app/services/authentication.service";

@Injectable({
    providedIn: "root"
})
export class CountyPlanningsService {
    _currentAnnualPlanning: BehaviorSubject<any>;
    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService
    ) {
        console.log("Hello World CountyPlanningsService");
        this._currentAnnualPlanning = new BehaviorSubject<any>(null);
    }

    currentAnnualPlanning(): Observable<any> {
        return this._currentAnnualPlanning.asObservable();
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
                        resolve(response["data"]);
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
