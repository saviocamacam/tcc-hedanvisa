import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotificationComponent } from "./notification.component";
import { Routes, RouterModule } from "@angular/router";

const routesNotification: Routes = [
    {
        path: "",
        component: NotificationComponent
    }
];
@NgModule({
    imports: [CommonModule, RouterModule.forChild(routesNotification)],
    declarations: [NotificationComponent]
})
export class NotificationModule {}
