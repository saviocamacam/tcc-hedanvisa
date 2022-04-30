import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthService } from "app/services/authentication.service";

@Injectable({
    providedIn: "root"
})
export class AddressService {
    _currentAddress: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService
    ) {
        console.log("Hello World AddressService");
    }

    public get currentAddress(): Observable<any> {
        return this._currentAddress.asObservable();
    }

    getPeopleAdrress(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`/api/address/address-info`).subscribe(
                response => {
                    resolve(response["data"].address);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    createAddress(address: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(`/api/address/address-info`, address)
                .subscribe(
                    response => {
                        resolve(response["data"].address);
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }

    updateAddress(address: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .put(`/api/address/address-info`, address)
                .subscribe(
                    response => {
                        resolve(response["data"].address);
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }

    getStates(): any {
        return new Promise((resolve, reject) => {
            this._httpClient.get("api/states?status=test").subscribe(
                states => {
                    resolve(states);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    getStateByUf(uf: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`api/states?abbr=${uf}`).subscribe(
                response => {
                    resolve(response);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    getCountiesByState(stateId: string) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(
                    `/api/profile/county-institutional?state_id=${stateId}&active=true`
                )
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }

    searchCEP(cep: any): Promise<any> {
        return new Promise((resolve, reject) => {
            // Nova variável "cep" somente com dígitos.
            cep = cep.replace(/\D/g, "");

            // Verifica se campo cep possui valor informado.
            if (cep !== "") {
                // Expressão regular para validar o CEP.
                const validacep = /^[0-9]{8}$/;

                // Valida o formato do CEP.
                if (validacep.test(cep)) {
                    this._httpClient
                        .get(`//viacep.com.br/ws/${cep}/json`)
                        .subscribe(
                            response => {
                                resolve(response);
                            },
                            error => {
                                reject(error);
                            }
                        );
                }
            }
        });
    }
}
