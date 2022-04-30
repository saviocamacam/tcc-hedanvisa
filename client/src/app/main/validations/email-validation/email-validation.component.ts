import { Component, OnInit, OnDestroy } from "@angular/core";
import { AccountService } from "../../../services/account.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FuseConfigService } from "@fuse/services/config.service";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { fuseAnimations } from "@fuse/animations";
import { filter, takeUntil } from "rxjs/operators";
import { User } from "app/model/user";
import { Subject } from "rxjs";

@Component({
    selector: "app-email-validation",
    templateUrl: "./email-validation.component.html",
    styleUrls: ["./email-validation.component.scss"],
    animations: fuseAnimations
})
export class EmailValidationComponent implements OnInit, OnDestroy {
    checked = false;
    codeCheck: any;
    mainEmail: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _route: ActivatedRoute,
        private _accountService: AccountService,
        private _fuseConfigService: FuseConfigService,
        private _fuseProgressBarService: FuseProgressBarService
    ) {
        console.log("Hello World EmailValidationComponent");

        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                }
            }
        };

        this._unsubscribeAll = new Subject();

        this._accountService.currentUser
            .pipe(
                filter(user => user instanceof User),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(
                user => {
                    this.mainEmail = user.$mainEmailAsObject.$address;
                },
                error => {
                    console.log(error);
                }
            );

        this._fuseProgressBarService.setMode("indeterminate");
    }

    ngOnInit() {
        this._fuseProgressBarService.show();

        this._route.queryParams.subscribe(queries => {
            this.codeCheck = queries["id"];
        });

        this._accountService
            .checkEmailValidation(this.codeCheck, this.mainEmail)
            .then(contact => {
                if (contact) {
                    this.checked = contact.checked;
                }

                this._fuseProgressBarService.hide();
            })
            .catch(error => {
                console.log(error);
                this._fuseProgressBarService.hide();
            });
    }

    ngOnDestroy(): void {
        console.log("EmailValidationComponent has destroyed");
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
