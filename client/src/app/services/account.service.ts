import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import jwtDecode from "jwt-decode";
import { User } from "../model/user";

import { People } from "../model/people";
import { BehaviorSubject, Observable } from "rxjs";

import { Contact } from "app/model/contact";
import { TokenService } from "app/services/token.service";
import { AuthService } from "app/services/authentication.service";
import { ProfilesService } from "app/services/profiles.service";
import { CookieService } from "ngx-cookie-service";
import { Profile } from "app/model/profile";

@Injectable({
    providedIn: "root"
})
export class AccountService {
    private _currentUser: BehaviorSubject<User>;
    cookieCurrentProfile: any;

    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService,
        private _profilesService: ProfilesService,
        private _tokenService: TokenService,
        public _cookieService: CookieService
    ) {
        this._currentUser = new BehaviorSubject(null);

        this._authService.isLoggedIn.subscribe(value => {
            if (value) {
                this.buildUser();
            } else {
                this.cookieCurrentProfile = null;
            }
        });
    }

    async buildUser() {

        return await this.getUserInfo()
            .then(async res => {
                const user: User = await Object.assign(new User(), res, {
                    people: undefined,
                    profiles: undefined
                });
                if (res["people"]) {
                    const people = await Object.assign(
                        new People(),
                        res["people"]
                    );
                    user.$peopleAsObject = await people;
                }
                if (res["mainEmail"]) {
                    const mainEmail = await Object.assign(
                        new Contact(),
                        res["mainEmail"]
                    );
                    user.$mainEmailAsObject = await mainEmail;
                }

                if (res["mainPhone"]) {
                    const mainPhone = await Object.assign(
                        new Contact(),
                        res["mainPhone"]
                    );
                    user.$mainPhoneAsObject = await mainPhone;
                }
                user.$profilesAsObjectOld = await res["profiles"];
                user.$profilesAsObjectOld = await res["profiles"];
                await this._profilesService._profilesOptions.next(
                    user.$profilesAsObjectOld
                );
                // console.log(this.cookieCurrentProfile);
                const cookieCurrentProfile = this._cookieService.check(
                    "atla.currentProfile"
                );

                // console.log(cookieCurrentProfile);
                if (cookieCurrentProfile) {
                    this.cookieCurrentProfile = JSON.parse(
                        this._cookieService.get("atla.currentProfile")
                    );
                    // console.log(this.cookieCurrentProfile);
                } else {
                    console.log("has no cookies");
                }
                if (!this.cookieCurrentProfile) {
                    this._cookieService.set(
                        "atla.currentProfile",
                        JSON.stringify({ id: user.$mainProfile }),
                        0,
                        "/"
                    );
                    await this._profilesService._currentProfile.next(
                        user.getMainProfileAsProfile()
                    );
                } else {
                    const profileId = this.cookieCurrentProfile;

                    this._profilesService
                        .getProfile(profileId.id)
                        .then(profile => {
                            // console.log(profile);
                            const profileO = user.getProfileAsObject(profile);
                            // console.log(profile);
                            this._profilesService._currentProfile.next(
                                profileO
                            );
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }

                // this._authService.$userProfileType = await user.$profiles.find(
                //     profile => profile.id === user.$mainProfile
                // ).$profileType;

                await this._currentUser.next(user);
            })
            .catch(err => {
                throw err;
            });
    }

    /**
     * Getter currentUser
     * @return {Observable<User>}
     */
    public get currentUser(): Observable<User> {
        return this._currentUser.asObservable();
    }

    getUserInfo(): any {
        // console.log(this._tokenService.jwtHelper.isTokenExpired());
        return new Promise((resolve, reject) => {
            this._httpClient.get(`/api/user/user-info`).subscribe(
                response => {
                    resolve(response["data"]["user"]);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    getBasicInfo(): Promise<User> {
        return new Promise((resolve, reject) => {
            this._httpClient.get("/api/user/basic-info").subscribe(
                response => {
                    resolve(response["data"].user);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    updateUserInfo(_id, user) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .put("/api/user/user-info", { _id, user })
                .subscribe(
                    response => {
                        resolve(response["data"].user);
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }

    shortNameExists(shortName: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(`/api/user/shortName-exists/${shortName}`)
                .subscribe(
                    response => {
                        resolve(response["data"].shortNameExists);
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }

    contactExists(address: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(`/api/contact/contact-exists/${address}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                })
                .subscribe(
                    response => {
                        resolve(response["data"].contactExists);
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }

    sendEmailValidation(email: string, shortName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post("/api/notification/send-email-validation", {
                    email,
                    shortName
                })
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

    sendEmailResetPassword(email: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post("/api/notification/send-email-reset-password", {
                    email
                })
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

    checkEmailResetPassword(
        codeCheck: string,
        email: string,
        password: any
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post("/api/notification/check-email-reset-password", {
                    codeCheck,
                    email,
                    password
                })
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

    checkEmailValidation(codeCheck: string, mainEmail: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post("/api/notification/check-email-validation", {
                    codeCheck,
                    mainEmail
                })
                .subscribe(
                    response => {
                        resolve(response["data"]["contact"]);
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }

    contactIsChecked(address: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(`/api/contact/contact-is-checked/${address}`)
                .subscribe(
                    response => {
                        resolve(response["data"].contactIsChecked);
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }
}
