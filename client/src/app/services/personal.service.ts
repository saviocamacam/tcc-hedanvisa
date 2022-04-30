import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { People } from "app/model/people";
import { AddressService } from "app/services/address.service";
import { Address } from "app/model/address";
import { AuthService } from "app/services/authentication.service";

@Injectable({
    providedIn: "root"
})
export class PersonalService {
    _currentPeople: BehaviorSubject<any>;

    constructor(
        private _httpClient: HttpClient,
        private _addressService: AddressService,
        private _authService: AuthService
    ) {
        console.log("Hello World People Service");

        this._currentPeople = new BehaviorSubject<any>(null);

        this._authService.isLoggedIn.subscribe(async value => {
            if (value) {
                // this.buildUser();
            }
        });
    }

    public get currentPeople(): Observable<People> {
        return this._currentPeople.asObservable();
    }

    getPeople(): Promise<People> {
        return new Promise((resolve, reject) => {
            this._httpClient.get("/api/people/people-info").subscribe(
                response => {
                    resolve(response["data"].people);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    createPeople(people): any {
        return new Promise((resolve, reject) => {
            this._httpClient.post("/api/people/people-info", people).subscribe(
                async response => {
                    await localStorage.setItem(
                        "token",
                        response["data"]["token"]
                    );
                    await resolve(response["data"]["people"]);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    updatePeople(people): any {
        return new Promise((resolve, reject) => {
            this._httpClient.put("/api/people/people-info", people).subscribe(
                async response => {
                    await localStorage.setItem(
                        "token",
                        response["data"]["token"]
                    );
                    await resolve(response["data"]["people"]);
                },
                error => {
                    reject(error);
                }
            );
        });
    }
}
