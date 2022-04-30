import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
    providedIn: "root"
})
export class TokenService {
    constructor(public jwtHelper: JwtHelperService) {
        this.jwtHelper = new JwtHelperService();
    }
    public get(): string {
        return localStorage.getItem("token");
    }

    public set(token: string): void {
        localStorage.setItem("token", token);
    }

    public deleteToken(): void {
        localStorage.removeItem("token");
    }

    public getProfile(type): any {
        const raw = localStorage.getItem("token");
        const payload = this.jwtHelper.decodeToken(raw);
        const profileFound = payload["user"]["profiles"].find(profile => {
            return profile["profileType"] === type;
        });
        return profileFound;
    }

    public getTokenDecoded(): string {
        return this.jwtHelper.decodeToken(this.get());
    }
}
