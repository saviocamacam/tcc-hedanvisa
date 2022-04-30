import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot
} from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { ProfilesService } from "app/services/profiles.service";

@Injectable({
    providedIn: "root"
})
export class ProfessorProfileService implements Resolve<any> {
    timeline: any;
    about: any;
    photosVideos: any;

    timelineOnChanged: BehaviorSubject<any>;
    aboutOnChanged: BehaviorSubject<any>;
    photosVideosOnChanged: BehaviorSubject<any>;

    _currentProfile: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _profileService: ProfilesService
    ) {
        this._currentProfile = new BehaviorSubject(null);
        // Set the defaults
        this.timelineOnChanged = new BehaviorSubject({});
        this.aboutOnChanged = new BehaviorSubject({});
        this.photosVideosOnChanged = new BehaviorSubject({});
    }

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
                this._profileService.getProfile(route.params._id)
                // this.getTimeline(),
                // this.getAbout(),
                // this.getPhotosVideos()
            ]).then(res => {
                console.log(res);
                this._currentProfile.next(res[0]);
                resolve();
            }, reject);
        });
    }

    /**
     * Get timeline
     */
    getTimeline(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get("api/home-timeline")
                .subscribe((timeline: any) => {
                    this.timeline = timeline;
                    this.timelineOnChanged.next(this.timeline);
                    resolve(this.timeline);
                }, reject);
        });
    }

    /**
     * Get about
     */
    getAbout(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this._httpClient.get("api/home-about").subscribe((about: any) => {
                this.about = about;
                this.aboutOnChanged.next(this.about);
                resolve(this.about);
            }, reject);
        });
    }

    /**
     * Get photos & videos
     */
    getPhotosVideos(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get("api/home-photos-videos")
                .subscribe((photosVideos: any) => {
                    this.photosVideos = photosVideos;
                    this.photosVideosOnChanged.next(this.photosVideos);
                    resolve(this.photosVideos);
                }, reject);
        });
    }
}
