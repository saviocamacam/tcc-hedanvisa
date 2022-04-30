import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AuthenticationModule } from "./authentication.module";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { EmailValidationComponent } from "../validations/email-validation/email-validation.component";

const routes: Routes = [
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "register",
        component: RegisterComponent
    },
    {
        path: "forgot-password",
        component: ForgotPasswordComponent
    },

    {
        path: "reset-password",
        component: ResetPasswordComponent
    },

    {
        path: "validacao-email",
        component: EmailValidationComponent
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        AuthenticationModule
    ],
    exports: [RouterModule]
})
export class AuthenticationRoutingModule {}
