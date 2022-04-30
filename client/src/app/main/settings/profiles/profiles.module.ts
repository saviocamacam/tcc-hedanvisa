import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import {
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatCardModule,
    MatTooltipModule,
    MatStepperModule,
    MatDividerModule,
    MatLineModule,
    MatListModule,
    MatMenuModule,
    MatToolbarRow,
    MatExpansionModule,
    MatChipsModule,
    MatDialogModule
} from "@angular/material";
import { ProfilesService } from "../../../services/profiles.service";
import { ProfileTypeFormDialogComponent } from "./profile-type-form/profile-type-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProfilesComponent } from "./profiles.component";
import { CdkTableModule } from "@angular/cdk/table";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FuseProgressBarModule } from "@fuse/components/progress-bar/progress-bar.module";
import { ProfileCountyFormComponent } from "./profile-county/profile-county-form/profile-county-form.component";
import { ProfileComunityFormComponent } from "./profile-comunity/profile-comunity-form/profile-comunity-form.component";
import { ProfileParentFormComponent } from "./profile-parent/profile-parent-form/profile-parent-form.component";
import { ProfileSchoolFormComponent } from "./profile-school/profile-school-form/profile-school-form.component";
import { ProfileStudentFormComponent } from "./profile-student/profile-student-form/profile-student-form.component";
import { ProfileProfessorFormComponent } from "./profile-professor/profile-professor-form/profile-professor-form.component";
import { AlertsModule } from "app/main/alerts/alerts.module";
import { FuseSharedModule } from "@fuse/shared.module";

const routes = [];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,

        MatIconModule,
        MatToolbarModule,
        MatSelectModule,
        MatOptionModule,
        FormsModule,
        MatSnackBarModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        CdkTableModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatGridListModule,
        MatCardModule,
        MatTooltipModule,
        MatStepperModule,
        MatDividerModule,
        MatListModule,
        MatLineModule,
        MatMenuModule,
        MatExpansionModule,
        MatChipsModule,
        MatGridListModule,
        MatDialogModule,
        FuseProgressBarModule,
        FuseSharedModule,
        AlertsModule
    ],
    declarations: [
        ProfileTypeFormDialogComponent,
        ProfilesComponent,
        ProfileCountyFormComponent,
        ProfileComunityFormComponent,
        ProfileParentFormComponent,
        ProfileSchoolFormComponent,
        ProfileStudentFormComponent,
        ProfileProfessorFormComponent
    ],
    providers: [ProfilesService],
    entryComponents: [ProfileTypeFormDialogComponent],
    exports: [ProfilesComponent]
})
export class ProfilesModule {}
