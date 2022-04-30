import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthService } from "../../../services/authentication.service";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(
        private _authService: AuthService,
        public router: Router,
        public jwtHelper: JwtHelperService
    ) {
    }

    canActivate(): boolean {
        if (!this._authService.isAuthenticated()) {
            this.router.navigate(["/auth/login"]); // signin
            return false;
        }

        return true;
    }
}
