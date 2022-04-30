import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SubjectsComponent } from "./subjects/subjects.component";
import { SubjectEditComponent } from "./subject-edit/subject-edit.component";
import { SubjectNewComponent } from "./subject-new/subject-new.component";

@NgModule({
    declarations: [
        SubjectsComponent,
        SubjectEditComponent,
        SubjectNewComponent
    ],
    imports: [CommonModule]
})
export class SubjectModule {}
