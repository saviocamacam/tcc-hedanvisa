import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarComponent } from "./calendar.component";
import { CalendarEventFormDialogComponent } from "./event-form/event-form.component";

import { RouterModule, Routes } from "@angular/router";
import {
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatToolbarModule
} from "@angular/material";
import { ColorPickerModule } from "ngx-color-picker";
import { CalendarModule as AngularCalendarModule } from "angular-calendar";

import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule } from "@fuse/components";

import { CalendarService } from "./calendar.service";

const routes: Routes = [
    {
        path: "",
        component: CalendarComponent,
        children: [],
        resolve: {
            chat: CalendarService
        }
    }
];

@NgModule({
    declarations: [CalendarComponent, CalendarEventFormDialogComponent],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatToolbarModule,

        AngularCalendarModule.forRoot(),
        ColorPickerModule,

        FuseSharedModule,
        FuseConfirmDialogModule
    ],
    providers: [CalendarService],
    entryComponents: [CalendarEventFormDialogComponent]
})
export class CalendarModule {}
