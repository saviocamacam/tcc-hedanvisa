import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ClassroomComponent } from "./classroom.component";
import {
    MatListModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatProgressSpinnerModule
} from "@angular/material";
import { ClassroomSidebarComponent } from "./classroom-sidebar/classroom-sidebar.component";
import { FuseSidebarModule, FuseConfirmDialogModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { ClassroomDetailComponent } from "./classroom-detail/classroom-detail.component";
import { EnrollmentDetailComponent } from "./enrollment-detail/enrollment-detail.component";
import { AlertsModule } from "../alerts/alerts.module";
import { EnrollmentListComponent } from "./enrollment-list/enrollment-list.component";
import { ProfessorListComponent } from "./professor-list/professor-list.component";
import { SchoolYearClassroomComponent } from "./school-year-classroom/school-year-classroom.component";
import { FrequencyModule } from "app/main/frequency/frequency.module";
import { ClassroomSidebarModule } from "app/main/classroom/classroom-sidebar/classroom-sidebar.module";
import { FrequencyListModule } from "app/main/frequency/frequency-list/frequency-list.module";

@NgModule({
    imports: [
        CommonModule,
        MatListModule,
        MatTabsModule,
        MatSelectModule,
        MatDialogModule,
        MatCardModule,
        MatDividerModule,
        MatButtonModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        RouterModule,
        FrequencyModule,
        AlertsModule,
        ClassroomSidebarModule,
        FrequencyListModule
    ],
    declarations: [
        ClassroomComponent,
        ClassroomDetailComponent,
        EnrollmentDetailComponent,
        EnrollmentListComponent,
        ProfessorListComponent,
        SchoolYearClassroomComponent
    ],
    exports: [EnrollmentDetailComponent, SchoolYearClassroomComponent],
    entryComponents: [EnrollmentDetailComponent, SchoolYearClassroomComponent]
})
export class ClassroomModule {}
