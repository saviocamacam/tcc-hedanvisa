import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { ProfilesService } from "app/services/profiles.service";
import { AuthService } from "../../../services/authentication.service";
import { filter, takeUntil } from "rxjs/operators";
import { TokenService } from "../../../services/token.service";
import { Subject } from "rxjs";
import { Profile } from "app/model/profile";

@Injectable({
    providedIn: "root"
})
export class RoleGuardService implements CanActivate {
    private _unsubscribeAll: Subject<any>;
    profile: Profile;
    constructor(
        private router: Router,
        private _profilesService: ProfilesService,
        private _authService: AuthService,
        private _tokenService: TokenService
    ) {
        console.log("Hello World RoleGuardService");

        this._unsubscribeAll = new Subject();

        this._profilesService
            .currentProfile()
            .pipe(
                filter(profile => profile instanceof Profile),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(profile => {
                setTimeout(() => {
                    if (profile) {
                        this.profile = profile;
                    }
                });
            });
    }

    canActivate(route: ActivatedRouteSnapshot) {
        if (!this._authService.isAuthenticated()) {
            this.router.navigate(["/auth/login"]); // signin
            return false;
        }

        if (!this._authService.hasProfile.value) {
            this.router.navigate(["/configuracoes/usuario"]);
            return false;
        }

        const permission = route.data.permission;

        const user = this._tokenService.getTokenDecoded()["user"];
        const mainProfile = user.profiles.find(
            profile => profile._id === user.mainProfile
        );

        let canActivate = false;
        if (this.profile) {
            canActivate = permission.only.includes(this.profile.$profileType);
        } else if (mainProfile) {
            canActivate = permission.only.includes(mainProfile.profileType);
        }

        if (!canActivate) {
            this.router.navigate(["/404"]);
        }

        return canActivate;
    }
}
