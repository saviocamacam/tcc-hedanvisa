import { NgModule, Injectable } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FrequencyComponent } from "./frequency.component";

import {
    MAT_DATE_LOCALE,
    MatListModule,
    MatTabsModule,
    MatSelectModule,
    MatDialogModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatGridListModule,
    MatAutocompleteModule,
    NativeDateAdapter
} from "@angular/material";
import {
    MatDateFormats,
    DateAdapter,
    MAT_DATE_FORMATS
} from "@angular/material/core";
import { RouterModule } from "@angular/router";

import { MatCheckboxModule } from "@angular/material/checkbox";

import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { AlertsModule } from "../alerts/alerts.module";
import {
    FrequencyFormComponent,
    FrequencyCheck
} from "./frequency-form/frequency-form.component";
import { SharedModule } from "app/main/shared-private/shared.module";

import { AvaliationRegisterObservationComponent } from "./avaliation-register-observation/avaliation-register-observation.component";
import { AvaliationRegisterComponent } from "./avaliation-register/avaliation-register.component";
import { AvaliationRegisterSimpleComponent } from "./avaliation-register-simple/avaliation-register-simple.component";

import { AvaliationRegisterComponent2 } from "./avaliation-register2/avaliation-register.component";
import { ContentRegisterComponent } from "./content-register/content-register.component";
import { CallRegisterComponent } from "./call-register/call-register.component";
import { FrequencyReportComponent } from "./frequency-report/frequency-report.component";
import { FrequencyReportInstructionsComponent } from "./frequency-report-instructions/frequency-report-instructions.component";

import { ClassroomSidebarModule } from "app/main/classroom/classroom-sidebar/classroom-sidebar.module";
import { FrequencyListModule } from "./frequency-list/frequency-list.module";
import { FrequencyCoverComponent } from "./frequency-cover/frequency-cover.component";

@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        if (displayFormat === "input") {
            let day: string = date.getDate().toString();
            day = +day < 10 ? "0" + day : day;
            let month: string = (date.getMonth() + 1).toString();
            month = +month < 10 ? "0" + month : month;
            let year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
        return date.toDateString();
    }
}
export const APP_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: { month: "short", year: "numeric", day: "numeric" }
    },
    display: {
        dateInput: "input",
        monthYearLabel: { year: "numeric", month: "numeric" },
        dateA11yLabel: {
            year: "numeric",
            month: "long",
            day: "numeric"
        },
        monthYearA11yLabel: { year: "numeric", month: "long" }
    }
};

@NgModule({
    declarations: [
        FrequencyComponent,
        FrequencyFormComponent,
        FrequencyCheck,
        CallRegisterComponent,
        ContentRegisterComponent,
        FrequencyReportComponent,
        AvaliationRegisterComponent,
        AvaliationRegisterComponent2,
        AvaliationRegisterSimpleComponent,
        AvaliationRegisterObservationComponent,
        FrequencyReportInstructionsComponent,
        FrequencyCoverComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        MatListModule,
        MatTabsModule,
        MatSelectModule,
        MatDialogModule,
        MatCardModule,
        MatDividerModule,
        MatButtonModule,
        MatInputModule,
        MatDatepickerModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatGridListModule,
        MatPaginatorModule,
        MatSortModule,
        MatSlideToggleModule,
        MatChipsModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatProgressSpinnerModule,
        AlertsModule,
        SharedModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        ClassroomSidebarModule,
        FrequencyListModule
    ],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
        { provide: MAT_DATE_LOCALE, useValue: "pt-BR" }
    ],
    entryComponents: [FrequencyFormComponent, FrequencyCheck],
    exports: []
})
export class FrequencyModule {}
