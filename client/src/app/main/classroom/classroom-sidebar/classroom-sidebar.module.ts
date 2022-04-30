import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClassroomSidebarComponent } from "./classroom-sidebar.component";
import {
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule
} from "@angular/material";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [ClassroomSidebarComponent],
    exports: [ClassroomSidebarComponent],
    imports: [
        CommonModule,
        MatSelectModule,
        MatFormFieldModule,
        FormsModule,
        MatButtonModule
    ]
})
export class ClassroomSidebarModule {}
