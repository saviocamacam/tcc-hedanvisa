import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { QuestionsCenterComponent } from "./questions-center/questions-center.component";
import { QuestionsEditComponent } from "./questions-edit/questions-edit.component";
import { QuestionsNewComponent } from "./questions-new/questions-new.component";
import { QuestionsDatabaseModule } from "./questions-database.module";
import { QuestionsDatabaseService } from "./questions-database.service";
import { QuestionsCenterService } from "app/main/questions-database/questions-center/questions-center-service.service";
import { QuestionsViewComponent } from "app/main/questions-database/questions-view/questions-view.component";

const routes: Routes = [
    {
        path: "",
        component: QuestionsCenterComponent,
        resolve: {
            questions_database: QuestionsCenterService
        }
    },
    {
        path: "new/:stepSlug",
        component: QuestionsNewComponent,
        resolve: {
            questions_database: QuestionsDatabaseService
        }
    },
    {
        path: "edit/:id/:stepSlug",
        component: QuestionsEditComponent,
        resolve: {
            questions_database: QuestionsDatabaseService
        }
    },
    {
        path: "view/:id/:stepSlug",
        component: QuestionsViewComponent,
        resolve: {
            questions_database: QuestionsDatabaseService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), QuestionsDatabaseModule],
    exports: [RouterModule]
})
export class QuestionsDatabaseRoutingModule {}
