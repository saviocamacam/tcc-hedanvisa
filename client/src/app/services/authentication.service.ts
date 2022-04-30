import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { TokenService } from "./token.service";
import { AccountService } from "app/services/account.service";
import { CookieService } from "ngx-cookie-service";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    public hasProfile: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );

    private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );

    constructor(
        public jwtHelper: JwtHelperService,
        public tokenService: TokenService,
        private http: HttpClient,
        private router: Router,
        public _cookieService: CookieService
    ) {
        console.log("Hello World Auth Service");
        this.jwtHelper = new JwtHelperService();
        this.loggedIn.next(this.isAuthenticated());
    }

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    public isAuthenticated(): boolean {
        const token = this.tokenService.get();
        return !this.jwtHelper.isTokenExpired(token);
    }

    public _hasProfile(): boolean {
        return this.hasProfile.value;
    }

    signup(shortName: string, mainEmail: string, password: string) {
        return this.http.post("/api/signup", {
            shortName,
            password,
            mainEmail
        });
    }

    login(shortName: string, password: string): any {
        return new Promise((resolve, reject) => {
            this.http
                .post("/api/signin", {
                    shortName,
                    password
                })
                .subscribe(
                    async res => {
                        await localStorage.setItem("token", res["token"]);
                        await localStorage.setItem(
                            "refreshToken",
                            res["refreshToken"]
                        );
                        const decodedToken = await this.tokenService.getTokenDecoded();
                        if (await decodedToken["user"].mainProfile) {
                            await this.hasProfile.next(true);
                        }
                        await this.loggedIn.next(true);
                        await resolve();
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }

    async logout() {
        console.log("saindo");
        this._cookieService.delete("atla.currentProfile", "/");
        await localStorage.removeItem("token");
        await localStorage.removeItem("refreshToken");
        await localStorage.clear();
        await this.loggedIn.next(false);
        await this.hasProfile.next(false);
        await this.router.navigate(["/auth/login"]);
    }

    updateToken() {
        return new Promise((resolve, reject) => {
            this.http
                .post(
                    "/api/updateToken",
                    {},
                    {
                        headers: {
                            "x-access-token": localStorage.getItem("token")
                        }
                    }
                )
                .subscribe(
                    response => {
                        localStorage.setItem("token", response["token"]);
                        this.hasProfile.next(true);
                        resolve(true);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }
}
