import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SubjectsRoutingModule } from "./subjects-routing.module";
import { SubjectsComponent } from "./subjects.component";
import {
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule
} from "@angular/material";

@NgModule({
    declarations: [SubjectsComponent],
    imports: [
        CommonModule,
        SubjectsRoutingModule,
        MatSelectModule,
        MatFormFieldModule,
        MatButtonModule,
        MatListModule,
        MatDividerModule
    ],
    exports: [SubjectsComponent]
})
export class SubjectsModule {}
