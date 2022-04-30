import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "app/services/authentication.service";

@Injectable({
  providedIn: "root"
})
export class EnrollmentService {

  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService,
  ) { }

  setEnrollmentState(_id: string, state: string): any {
    return new Promise((resolve, reject) => {
      this._httpClient
        .put(`api/enrollment/${_id}/state`, {
          state,
        })
        .subscribe(res => {
          console.log(res["data"]);
          resolve(res["data"]);
        }, error => {
          reject(error);
        });
    });
  }
}
