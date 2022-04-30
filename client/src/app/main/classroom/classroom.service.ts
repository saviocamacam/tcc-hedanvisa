import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from "app/services/authentication.service";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ClassroomService {
    _currentClassroom: BehaviorSubject<any>;
    _currentSchool: BehaviorSubject<any>;
    onSearchTextChanged: BehaviorSubject<any>;
    _isFrequencyPage: BehaviorSubject<any>;
    _enrollmentsList: BehaviorSubject<any>;

    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService
    ) {
        console.log("Hello World ClassroomService");
        this.onSearchTextChanged = new BehaviorSubject("");

        this._currentClassroom = new BehaviorSubject<any>(null);
        this._currentSchool = new BehaviorSubject<any>(null);

        this._isFrequencyPage = new BehaviorSubject(false);
        this._enrollmentsList = new BehaviorSubject(null);
    }

    isFrequencyPage(): Observable<any> {
        return this._isFrequencyPage.asObservable();
    }

    currentClassroom(): Observable<any> {
        return this._currentClassroom.asObservable();
    }

    currentSchool(): Observable<any> {
        return this._currentSchool.asObservable();
    }

    getSchoolYearClassroomBySchool(schoolId): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(`/api/school-year-classroom/${schoolId}`)
                .subscribe(
                    res => resolve(res["data"].schoolYearClassroom),
                    error => reject(error)
                );
        });
    }

    createSchoolYearClassroom(schoolYearClassroom): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post("/api/school-year-classroom", schoolYearClassroom)
                .subscribe(
                    res => {
                        this.getClassRoomsBySchoolId(
                            res["data"].schoolYearClassroom.school
                        );
                        resolve(res["data"]);
                    },
                    error => reject(error)
                );
        });
    }

    getClassRoomsBySchoolId(params: HttpParams): any {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(`/api/classroom`, {
                    params: params
                })
                .subscribe(
                    async res => {
                        const classrooms = await res["data"];
                        await classrooms.sort((a, b) => {
                            if (a.series > b.series) {
                                return 1;
                            }
                            if (a.series < b.series) {
                                return -1;
                            }
                            return 0;
                        });
                        await this._currentClassroom.next(classrooms[0]);
                        await resolve(classrooms);
                    },
                    err => reject(err)
                );
        });
    }

    getClassroomById(classroom: any): any {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`/api/classroom/${classroom}`).subscribe(
                res => resolve(res["data"]),
                err => reject(err)
            );
        });
    }

    getClassroomFrequencie(_id: any): any {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`/api/classroom/${_id}/frequency`).subscribe(
                res => resolve(res["data"]),
                err => reject(err)
            );
        });
    }

    getClassroomsByProfessor(professorId: string): Promise<any[]> {
        console.log("getClassroomsByProfessor");
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(`/api/profile/professor/${professorId}/classrooms`)
                .subscribe(
                    res => {
                        const classrooms = res["data"].classrooms;
                        this._currentClassroom.next(
                            classrooms.length > 0 ? classrooms[0] : null
                        );
                        resolve(classrooms);
                    },
                    err => reject(err)
                );
        });
    }

    getEnrollments(_id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(`/api/enrollment/filter-classroom?classroom=${_id}`)
                .subscribe(
                    res => {
                        const enrollments = res["data"];
                        enrollments.sort((a, b) => {
                            if (a.basic["no"] > b.basic["no"])
                                return 1;
                            if (a.basic["no"] < b.basic["no"])
                                return -1;
                            return 0;
                        });
                        this._enrollmentsList.next(enrollments);
                        resolve(enrollments);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }

    deactivateProfessor(id: any, _idClassroom: any): any {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(`/api/classroom/${_idClassroom}/unlinkin-professor`, {
                    professor: id
                })
                .subscribe(
                    res => resolve(res["data"]),
                    err => reject(err)
                );
        });
    }

    activateProfessor(id: any, _idClassroom: any): any {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(`/api/classroom/${_idClassroom}/linkin-professor`, {
                    professor: id
                })
                .subscribe(
                    res => resolve(res["data"]),
                    err => reject(err)
                );
        });
    }

    getProfessors(_idClassroom: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(`/api/classroom/${_idClassroom}/professors`)
                .subscribe(
                    resp => resolve(resp["data"]),
                    error => reject(error)
                );
        });
    }
}
