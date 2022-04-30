import { InMemoryDbService } from "angular-in-memory-web-api";

import { CalendarFakeDb } from "./calendar";
import { AcademyFakeDb } from "app/fake-db/academy";
import { ChatFakeDb } from "./chat";
import { ContactsFakeDb } from "./contacts";
import { HomeFakeDb } from "./home";
import { TaskFakeDb } from "./tasks";
import { StatesFakeDb } from "./states";
import { QuestionFakeDb } from "app/fake-db/question";
import { DisciplineFakeDb } from "app/fake-db/discipline";
import { PlanningFakeDb } from "app/fake-db/planning";
import { ProvaBrasilFakeDb } from "app/fake-db/prova-brasil";
import { LicensesFakeDb } from "app/fake-db/license";
// import { ProjectDashboardDb } from "app/fake-db/dashboard-project";
// import { AnalyticsDashboardDb } from "app/fake-db/dashboard-analytics";
// import { ECommerceFakeDb } from "app/fake-db/e-commerce";
// import { MailFakeDb } from "app/fake-db/mail";
// import { FileManagerFakeDb } from "app/fake-db/file-manager";
// import { TodoFakeDb } from "app/fake-db/todo";
// import { ScrumboardFakeDb } from "app/fake-db/scrumboard";
// import { InvoiceFakeDb } from "app/fake-db/invoice";
// import { SearchFakeDb } from "app/fake-db/search";
// import { FaqFakeDb } from "app/fake-db/faq";
// import { KnowledgeBaseFakeDb } from "app/fake-db/knowledge-base";
// import { IconsFakeDb } from "app/fake-db/icons";
// import { QuickPanelFakeDb } from "app/fake-db/quick-panel";

export class FakeDbService implements InMemoryDbService {
    createDb(): any {
        return {
            states: StatesFakeDb.states,

            // // Dashboards
            // "project-dashboard-projects": ProjectDashboardDb.projects,
            // "project-dashboard-widgets": ProjectDashboardDb.widgets,
            // "analytics-dashboard-widgets": AnalyticsDashboardDb.widgets,

            // Calendar
            calendar: CalendarFakeDb.data,

            // Questions
            "question-database": QuestionFakeDb.question,
            "planning-database": PlanningFakeDb.planning,

            // Disciplines
            disciplines: DisciplineFakeDb.disciplines,
            years: DisciplineFakeDb.years,
            "prova-brasil": ProvaBrasilFakeDb.disciplines,

            // E-Commerce
            // "e-commerce-dashboard": ECommerceFakeDb.dashboard,
            // "e-commerce-products": ECommerceFakeDb.products,
            // "e-commerce-orders": ECommerceFakeDb.orders,

            // Academy
            "academy-categories": AcademyFakeDb.categories,
            "academy-courses": AcademyFakeDb.courses,
            "academy-course": AcademyFakeDb.course,

            // // Mail
            // "mail-mails": MailFakeDb.mails,
            // "mail-folders": MailFakeDb.folders,
            // "mail-filters": MailFakeDb.filters,
            // "mail-labels": MailFakeDb.labels,

            // Chat
            "chat-contacts": ChatFakeDb.contacts,
            "chat-chats": ChatFakeDb.chats,
            "chat-user": ChatFakeDb.user,

            // // File Manager
            // "file-manager": FileManagerFakeDb.files,

            // Contacts
            "contacts-contacts": ContactsFakeDb.contacts,
            "contacts-user": ContactsFakeDb.user,

            // Tasks
            "tasks-tasks": TaskFakeDb.tasks,
            "tasks-users": TaskFakeDb.users,
            "tasks-subjects": TaskFakeDb.subjects,

            // // Todo
            // "todo-todos": TodoFakeDb.todos,
            // "todo-filters": TodoFakeDb.filters,
            // "todo-tags": TodoFakeDb.tags,

            // // Scrumboard
            // "scrumboard-boards": ScrumboardFakeDb.boards,

            // // Invoice
            // invoice: InvoiceFakeDb.invoice,

            // Profile
            "home-timeline": HomeFakeDb.timeline,
            "home-photos-videos": HomeFakeDb.photosVideos,
            "home-about": HomeFakeDb.about,

            // // Search
            // "search-classic": SearchFakeDb.classic,
            // "search-table": SearchFakeDb.table,

            // // FAQ
            // faq: FaqFakeDb.data,

            // // Knowledge base
            // "knowledge-base": KnowledgeBaseFakeDb.data,

            // // Icons
            // icons: IconsFakeDb.icons,

            // // Quick Panel
            // "quick-panel-notes": QuickPanelFakeDb.notes,
            // "quick-panel-events": QuickPanelFakeDb.events

            // Termos e Licenças
            "cc-licenses": LicensesFakeDb.licenses
        };
    }
}
