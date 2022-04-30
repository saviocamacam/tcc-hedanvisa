import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatToolbarModule,
    MatNativeDateModule,
    MAT_DATE_LOCALE,
    MatTabsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatGridListModule,
    MatTooltipModule,
    MatCardModule
} from "@angular/material";
import {
    MAT_MOMENT_DATE_FORMATS,
    MomentDateAdapter
} from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { TranslateModule } from "@ngx-translate/core";

import { FuseModule } from "@fuse/fuse.module";
import { FuseSharedModule } from "@fuse/shared.module";
import {
    FuseSidebarModule,
    FuseThemeOptionsModule,
    FuseConfirmDialogModule
} from "@fuse/components";

import { fuseConfig } from "./fuse-config";

import { AppComponent } from "./app.component";
import { LayoutModule } from "./layout/layout.module";

import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import { FakeDbService } from "./fake-db/fake-db.service";
import { AuthGuardService } from "./main/authentication/guards/auth-guard.service";
import { JwtModule, JWT_OPTIONS } from "@auth0/angular-jwt";
import { TokenService } from "./services/token.service";
import { FuseProgressBarModule } from "@fuse/components/progress-bar/progress-bar.module";
import { AppRoutingModule } from "./app-routing.module";
import { CookieService } from "ngx-cookie-service";
import { AuthInterceptorService } from "app/services/auth-interceptor.service";

export function jwtOptionsFactory(tokenService) {
    return {
        tokenGetter: () => {
            return tokenService.get();
        }
    };
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,

        JwtModule.forRoot({
            jwtOptionsProvider: {
                provide: JWT_OPTIONS,
                useFactory: jwtOptionsFactory,
                deps: [TokenService]
            }
        }),

        TranslateModule.forRoot(),

        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true
        }),

        FuseConfirmDialogModule,

        // Material moment date module
        MatMomentDateModule,
        MatNativeDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatSelectModule,
        MatTabsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatGridListModule,
        MatTooltipModule,
        MatCardModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        FuseProgressBarModule,

        // App modules
        LayoutModule,

        // RoutingModules
        AppRoutingModule
    ],
    bootstrap: [AppComponent],
    providers: [
        AuthGuardService,
        CookieService,
        { provide: MAT_DATE_LOCALE, useValue: "pt-BR" },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        }
    ],
    declarations: [AppComponent],
    exports: [],
    entryComponents: []
})
export class AppModule {}
