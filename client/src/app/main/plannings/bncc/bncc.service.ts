import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Hability } from "./hability.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from "app/services/authentication.service";

@Injectable({
    providedIn: "root"
})
export class BnccService {
    mails: Hability[];
    selectedMails: Hability[];
    currentMail: Hability;
    searchText = "";

    folders: any[];
    filters: any[];
    labels: any[];
    routeParams: any;

    onHabilitiesChanged: BehaviorSubject<any>;
    onDescriptorsChanged: BehaviorSubject<any>;
    onSelectedMailsChanged: BehaviorSubject<any>;
    onCurrentMailChanged: BehaviorSubject<any>;
    onFoldersChanged: BehaviorSubject<any>;
    onFiltersChanged: BehaviorSubject<any>;
    onLabelsChanged: BehaviorSubject<any>;
    onSearchTextChanged: BehaviorSubject<any>;

    constructor(
        private httpClient: HttpClient,
        private _authService: AuthService
    ) {
        this.onHabilitiesChanged = new BehaviorSubject([]);
        this.onDescriptorsChanged = new BehaviorSubject([]);
        this._authService.isLoggedIn.subscribe(value => {});
    }

    toggleSelectedMail(id: any) {}
    updateMail(hability: any) {}

    /**
     * Set current mail by id
     *
     * @param id
     */
    setCurrentMail(id): void {
        this.currentMail = this.mails.find(mail => {
            return mail.id === id;
        });

        this.onCurrentMailChanged.next(this.currentMail);
    }

    getDescriptors(id) {
        return new Promise((resolve, reject) => {
            this.httpClient
                .get("api/prova-brasil/" + id)
                .subscribe((response: any) => {
                    this.onDescriptorsChanged.next(response);
                    resolve(response);
                }, reject);
        });
    }

    getHabilities(params: HttpParams): any {
        console.log(params);
        return new Promise((resolve, reject) => {
            this.httpClient
                .get(`/api/competence/hability`, {
                    params: params
                })
                .subscribe(
                    res => {
                        console.log(res);
                        this.onHabilitiesChanged.next(
                            res["data"]["habilities"]
                        );
                        resolve(res["data"]);
                    },
                    err => {
                        console.error(err);
                        reject(err);
                    }
                );
        });
    }
}
