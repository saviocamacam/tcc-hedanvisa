import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoursesComponent } from "./courses/courses.component";
import { RouterModule, Routes } from "@angular/router";

const courseRoutes: Routes = [
    {
        path: "",
        component: CoursesComponent
    }
];

@NgModule({
    declarations: [CoursesComponent],
    imports: [CommonModule, RouterModule.forChild(courseRoutes)]
})
export class CourseModule {}
