import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FrequencyListComponent } from "./frequency-list.component";
import {
    MatProgressBarModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTooltipModule,
    MatSortModule,
    MatIconModule,
    MatMenuModule
} from "@angular/material";
import { RouterModule } from "@angular/router";

@NgModule({
    declarations: [FrequencyListComponent],
    exports: [FrequencyListComponent],
    imports: [
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        CommonModule,
        MatProgressBarModule,
        MatTableModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        RouterModule,
        MatTooltipModule,
        MatSortModule
    ]
})
export class FrequencyListModule {}
