import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SchoolListComponent } from "./school-list/school-list.component";
import { SchoolDetailComponent } from "./school-detail/school-detail.component";
import {
    MatTableModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatSnackBarModule,
    MatSortModule,
    MatSelectModule,
    MatRippleModule,
    MatChipsModule,
    MatCardModule,
    MatDatepickerModule,
    MatTooltipModule
} from "@angular/material";
import { Routes, RouterModule } from "@angular/router";
import { FuseSearchBarModule, FuseSidebarModule } from "@fuse/components";
import { CountySchoolsComponent } from "./county-schools.component";
import { FuseSharedModule } from "@fuse/shared.module";
import { SchoolCalendarComponent } from "./school-calendar/school-calendar.component";
import { SchoolYearComponent } from "./school-year/school-year.component";
import { FuseProgressBarModule } from "@fuse/components/progress-bar/progress-bar.module";
import { SchoolClassroomsComponent } from "./school-classrooms/school-classrooms.component";
import { EnrollmentDetailComponent } from "./enrollment-detail/enrollment-detail.component";
import { CountySchoolsSidebarComponent } from "./county-schools-sidebar/county-schools-sidebar.component";
import { SchoolCoursesComponent } from "./school-courses/school-courses.component";
import { AlertsModule } from "app/main/alerts/alerts.module";

const routes: Routes = [
    {
        path: "",
        component: CountySchoolsComponent
    },
    {
        path: ":school_id/turmas",
        component: SchoolClassroomsComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,

        MatTableModule,
        MatListModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatGridListModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatButtonModule,
        MatChipsModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTabsModule,
        MatCardModule,
        MatDatepickerModule,
        MatTooltipModule,

        AlertsModule,

        FuseSidebarModule,
        FuseProgressBarModule,
        FuseSearchBarModule,
        FuseSharedModule
    ],
    declarations: [
        SchoolListComponent,
        SchoolDetailComponent,
        CountySchoolsComponent,
        SchoolCalendarComponent,
        SchoolYearComponent,
        SchoolClassroomsComponent,
        EnrollmentDetailComponent,
        CountySchoolsSidebarComponent,
        SchoolCoursesComponent
    ],
    entryComponents: [
        SchoolDetailComponent,
        SchoolYearComponent,
        EnrollmentDetailComponent
    ]
})
export class CountySchoolsModule {}
