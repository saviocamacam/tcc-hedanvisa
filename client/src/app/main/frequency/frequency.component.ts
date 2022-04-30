import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { ProfilesService } from "../../services/profiles.service";
import {
    filter,
    takeUntil,
    debounceTime,
    distinctUntilChanged
} from "rxjs/operators";
import { Profile } from "app/model/profile";
import { MatDialog } from "@angular/material";
import { AttentionAlertDialogComponent } from "../alerts/attention/attention.component";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { fuseAnimations } from "@fuse/animations";
import { FrequencyFormComponent } from "./frequency-form/frequency-form.component";
import { FormControl } from "@angular/forms";
import { ClassroomService } from "../classroom/classroom.service";
import { FrequencyService } from "./frequency.service";

@Component({
    selector: "app-frequency",
    templateUrl: "./frequency.component.html",
    styleUrls: ["./frequency.component.scss"],
    animations: fuseAnimations
})
export class FrequencyComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;

    profile: Profile;
    profileActive = false;

    classroom: any;

    searchInput: FormControl;

    constructor(
        private _profilesService: ProfilesService,
        private _classroomService: ClassroomService,
        private _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        private _frequencyService: FrequencyService
    ) {
        console.log("Hello World FrequencyComponent");
        this._unsubscribeAll = new Subject();

        this.searchInput = new FormControl("");
    }

    ngOnInit() {
        this._classroomService._isFrequencyPage.next(true);

        this._classroomService
            .currentClassroom()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(classroom => {
                if (classroom) {
                    this.classroom = classroom;
                }
            });

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
                this._frequencyService.onSearchTextChanged.next(searchText);
            });
    }

    ngOnDestroy() {
        console.log("FrequencyComponent destroyed.");

        this._classroomService._isFrequencyPage.next(false);
        this._classroomService._currentClassroom.next(null);

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    newFrequency() {
        const dialogRef = this._matDialog.open(FrequencyFormComponent, {
            disableClose: true,
            panelClass: "custom-dialog-container",
            data: {
                action: "new"
            }
        });

        dialogRef.afterClosed().subscribe(() => {
            this._classroomService._currentClassroom.next(this.classroom);
        });
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
