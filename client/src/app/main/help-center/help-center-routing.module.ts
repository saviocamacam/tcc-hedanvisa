import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FaqComponent } from "app/main/help-center/faq/faq.component";
import { FaqService } from "app/main/help-center/faq/faq.service";
import { HelpCenterModule } from "app/main/help-center/help-center.module";

const routes = [
    {
        path: "faq",
        component: FaqComponent,
        resolve: {
            faq: FaqService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), HelpCenterModule],
    exports: [RouterModule]
})
export class HelpCenterRoutingModule {}
