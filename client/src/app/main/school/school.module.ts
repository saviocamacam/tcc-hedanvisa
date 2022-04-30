import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SchoolsListComponent } from "./schools-list/schools-list.component";
import {
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatRippleModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatChipsModule,
    MatGridListModule,
    MatInputModule,
    MatListModule
} from "@angular/material";
import { SchoolsComponent } from "./school.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FuseProgressBarModule } from "@fuse/components/progress-bar/progress-bar.module";
import { AlertsModule } from "../alerts/alerts.module";
import { FuseSharedModule } from "@fuse/shared.module";
import { SchoolYearComponent } from "./school-year/school-year.component";
import { FuseSearchBarModule, FuseSidebarModule } from "@fuse/components";
import { SchoolCalendarComponent } from "./school-calendar/school-calendar.component";

@NgModule({
    declarations: [
        SchoolsListComponent,
        SchoolsComponent,
        SchoolCalendarComponent,
        SchoolYearComponent
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatRippleModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatSortModule,
        FuseProgressBarModule,
        FuseSharedModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        AlertsModule,

        MatListModule,
        MatInputModule,
        MatGridListModule,
        MatChipsModule,
        MatSelectModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatTooltipModule,

        FuseSidebarModule,
        FuseSearchBarModule
    ],
    exports: [],
    entryComponents: [SchoolYearComponent]
})
export class SchoolModule {}
