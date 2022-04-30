import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ClassroomComponent } from "./classroom.component";
import { ClassroomModule } from "./classroom.module";
import { RoleGuardService } from "../authentication/guards/role-guard.service";

const routes: Routes = [
    {
        path: "",
        component: ClassroomComponent
    },
    {
        path: "**",
        loadChildren: "../errors/error404/error404.module#Error404Module"
    }
];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes), ClassroomModule],
    exports: [RouterModule]
})
export class ClassroomRoutingModule {}
