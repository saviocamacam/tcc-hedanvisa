import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "./main/authentication/guards/auth-guard.service";
import { HomeModule } from "./main/home/home.module";
import { HomeComponent } from "./main/home/home.component";
import { LandingPageComponent } from "./main/landing/landing-page/landing-page.component";
import { LandingModule } from "./main/landing/landing.module";
import { RoleGuardService } from "./main/authentication/guards/role-guard.service";
import { AuthorizationModule } from "./main/authorization/authorization.module";
import { AuthorizationRoutingModule } from "./main/authorization/authorization-routing.module";

const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "inicio",
        pathMatch: "full"
    },
    {
        path: "boas-vindas",
        loadChildren:
            "./main/landing/landing-routing.module#LandingRoutingModule"
    },
    {
        path: "inicio",
        loadChildren: "./main/home/home-routing.module#HomeRoutingModule",
        canActivate: [AuthGuardService]
        // canActivate: [RoleGuardService],
        // data: {
        //     permission: {
        //         only: ["ProfileSchool", "ProfileProfessor", "ProfileCounty"]
        //     }
        // }
    },
    {
        path: "auth",
        loadChildren:
            "./main/authentication/authentication-routing.module#AuthenticationRoutingModule"
    },
    {
        path: "configuracoes",
        loadChildren: "./main/settings/settings.module#SettingsModule",
        canActivate: [AuthGuardService]
    },
    {
        path: "autorizacoes",
        loadChildren:
            "./main/authorization/authorization-routing.module#AuthorizationRoutingModule",
        canActivate: [AuthGuardService]
        // canActivate: [RoleGuardService],
        // data: {
        //     permission: {
        //         only: ["ProfileCounty", "ProfileSchool"]
        //     }
        // }
    },
    {
        path: "escola",
        loadChildren: "./main/school/school-routing.module#SchoolRoutingModule",
        canActivate: [AuthGuardService]
    },
    {
        path: "turmas",
        loadChildren:
            "./main/classroom/classroom-routing.module#ClassroomRoutingModule",
        canActivate: [AuthGuardService]
        // canActivate: [RoleGuardService],
        // data: {
        //     permission: {
        //         only: ["ProfileSchool", "ProfileProfessor", "ProfileCounty"]
        //     }
        // }
    },
    {
        path: "frequencias",
        loadChildren:
            "./main/frequency/frequency-routing.module#FrequencyRoutingModule",
        canActivate: [AuthGuardService]
        //  canActivate: [RoleGuardService],
        // data: {
        //     permission: {
        //         only: ["ProfileSchool", "ProfileProfessor"]
        //     }
        // }
    },
    {
        path: "planejamentos",
        loadChildren:
            "./main/plannings/plannings-routing.module#PlanningsRoutingModule",
        canActivate: [AuthGuardService]
        // canActivate: [RoleGuardService],
        // data: {
        //     permission: {
        //         only: ["ProfileSchool", "ProfileProfessor", "ProfileCounty"]
        //     }
        // }
    },

    {
        path: "professor",
        loadChildren:
            "./main/professor/professor-routing.module#ProfessorRoutingModule",
        canActivate: [AuthGuardService]
        // canActivate: [RoleGuardService],
        // data: {
        //     permission: {
        //         only: ["ProfileSchool", "ProfileProfessor", "ProfileCounty"]
        //     }
        // }
    },
    {
        path: "rede",
        loadChildren: "./main/county/county-routing.module#CountyRoutingModule",
        canActivate: [AuthGuardService]
        // canActivate: [RoleGuardService],
        // data: {
        //     permission: {
        //         only: ["ProfileSchool", "ProfileProfessor", "ProfileCounty"]
        //     }
        // }
    },

    {
        path: "**",
        loadChildren: "./main/errors/error404/error404.module#Error404Module"
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(
            appRoutes
            // { enableTracing: true }
        )
    ],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutingModule { }
