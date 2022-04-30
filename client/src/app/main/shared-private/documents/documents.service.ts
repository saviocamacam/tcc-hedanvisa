import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class DocumentsService {
    file: File;

    _documentsList: BehaviorSubject<any[]>;
    _currentFile: BehaviorSubject<any>;

    constructor(private _httpClient: HttpClient) {
        console.log("Hello World Document Service.");

        this._documentsList = new BehaviorSubject(null);
        this._currentFile = new BehaviorSubject(null);

        this.getListDocuments();
    }

    documentsList(): Observable<any[]> {
        return this._documentsList.asObservable();
    }

    currentFile(): Observable<any> {
        return this._currentFile.asObservable();
    }

    uploadFile(file: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post("/api/file/upload", file).subscribe(
                response => {
                    resolve(response["data"].file);
                },
                error => {
                    console.log("service error");
                    reject(error);
                }
            );
        });
    }

    createDocument(document: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post("/api/document", document).subscribe(
                response => {
                    this.getListDocuments();
                    resolve(response["data"].document);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    getDocument(hashname: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`/api/document/${hashname}`).subscribe(
                response => {
                    resolve(response["data"].document);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    getListDocuments(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this._httpClient.get("/api/document").subscribe(
                response => {
                    this._documentsList.next(response["data"].documents);
                    resolve(response["success"]);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    renderFile(hashname: any) {
        this._currentFile.next(`/api/file/pdf/${hashname}`);
    }
}
