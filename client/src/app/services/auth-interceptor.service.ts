import { Injectable } from "@angular/core";
import {
    HttpInterceptor,
    HttpRequest,
    HttpEvent,
    HttpHandler
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const idToken = localStorage.getItem("token");
        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set("x-access-token", idToken)
            });

            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }
}
