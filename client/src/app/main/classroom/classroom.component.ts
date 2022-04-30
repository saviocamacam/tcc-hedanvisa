import { Location } from "@angular/common";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { ClassroomService } from "./classroom.service";
import {
    takeUntil,
    filter,
    switchMap,
    debounceTime,
    distinctUntilChanged
} from "rxjs/operators";
import { Subject } from "rxjs";
import { MatDialog } from "@angular/material";
import { ProfilesService } from "../../services/profiles.service";
import { Profile } from "app/model/profile";
import { fuseAnimations } from "@fuse/animations";
import { ActivatedRoute } from "@angular/router";
import { FormControl } from "@angular/forms";
import { AttentionAlertDialogComponent } from "../alerts/attention/attention.component";
import { SchoolService } from "app/main/school/school.service";

@Component({
    selector: "app-classroom",
    templateUrl: "./classroom.component.html",
    styleUrls: ["./classroom.component.scss"],
    animations: fuseAnimations
})
export class ClassroomComponent implements OnInit, OnDestroy {
    classroom: any;
    profile: Profile;
    profileActive = false;

    searchInput: FormControl;

    private _unsubscribeAll: Subject<any>;
    school: any;

    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _classroomService: ClassroomService,
        private _matDialog: MatDialog,
        private _profilesService: ProfilesService,
        private _schoolService: SchoolService,
        private _location: Location
    ) {
        console.log("Hello World ClassroomComponent");
        this._unsubscribeAll = new Subject<any>();
        this.searchInput = new FormControl("");
    }
    ngOnInit() {
        this._classroomService._isFrequencyPage.next(false);

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

                        if (this.profile.$profileType === "ProfileCounty") {
                            if (this.profile["county"].status === "accepted") {
                                this.profileActive = true;
                            } else {
                                this._matDialog.open(
                                    AttentionAlertDialogComponent,
                                    {
                                        width: "400px",
                                        data: {
                                            justification: `Você ainda não está autorizado para vizualizar as Turmas.
                                                Entre em contato conosco!
                                                `
                                        }
                                    }
                                );
                            }
                        } else if (
                            this.profile.$profileType === "ProfileSchool" ||
                            this.profile.$profileType === "ProfileProfessor"
                        ) {
                            if (this.profile["school"].status === "accepted") {
                                this.profileActive = true;
                            } else {
                                this._matDialog.open(
                                    AttentionAlertDialogComponent,
                                    {
                                        width: "400px",
                                        data: {
                                            justification: `Você ainda não está autorizado para vizualizar as Turmas.
                                                Entre em contato conosco!
                                                `
                                        }
                                    }
                                );
                            }
                        }
                    }
                });
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._classroomService.onSearchTextChanged.next(searchText);
            });

        this._schoolService.$currentSchoolInstituional
            .pipe(
                filter(school => school != null),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(school => {
                this.school = school;
                document.title = `${titleString(school.name)} | ATLA`;
            });
    }

    ngOnDestroy(): void {
        document.title = "ATLA | Ensino";
        this._classroomService._currentClassroom.next(null);

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    back() {
        document.title = "ATLA | Ensino";
        this._location.back();
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}

function titleString(word: string) {
    return word
        .toLowerCase()
        .split(" ")
        .map(word2 => titleCaseWord(word2))
        .join(" ");
}

function titleCaseWord(word: string) {
    if (!word) {
        return word;
    }
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
}
