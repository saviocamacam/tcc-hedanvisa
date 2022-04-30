import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ProfileComunity } from "app/model/profile-comunity";
import { ProfilesService } from "../../../../../services/profiles.service";

@Component({
    selector: "profile-comunity-form",
    templateUrl: "./profile-comunity-form.component.html",
    styleUrls: ["./profile-comunity-form.component.scss"]
})
export class ProfileComunityFormComponent implements OnInit, OnInit {
    profileForm: FormGroup;
    profile: ProfileComunity;

    personality: any;

    voluntaries: any;

    constructor(
        private _formBuilder: FormBuilder,
        private _profilesService: ProfilesService
    ) {}

    ngOnInit() {
        this.profileForm = this.createProfileComunityForm();

        this.voluntaries = this._profilesService.getVoluntaries();
    }

    createProfileComunityForm() {
        return this._formBuilder.group({
            personality: ["", Validators.compose([Validators.required])],
            name: [""],
            post: [""],
            type: [""],
            voluntary: [""]
        });
    }

    personalityChanged(personality) {
        this.personality = personality;
    }
}
