import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { takeUntil, filter } from "rxjs/operators";
import { Subject } from "rxjs";

import { ProfilesService } from "app/services/profiles.service";
import { ClassroomService } from "app/main/classroom/classroom.service";

import Counter from "app/utils/Counter";

@Component({
    selector: "app-frequency-cover",
    templateUrl: "./frequency-cover.component.html",
    styleUrls: ["./frequency-cover.component.scss"]
})
export class FrequencyCoverComponent implements OnInit, OnChanges {
    @Input() matrixes;

    public myMatrixes = "";

    private _unsubscribeAll = new Subject();
    public profile: any;
    public enrollments: any;
    public classroom: any;

    constructor(
        private _profileService: ProfilesService,
        private _classroomService: ClassroomService
    ) {}

    ngOnInit() {
        // Obtendo o perfil do usuário atual
        this._profileService
            .currentProfile()
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(profile => profile != null)
            )
            .subscribe(profile => {
                this.profile = profile;
                console.log(this.profile);
            });

        // Carregando as informações dos alunos da turma selecionada
        this._classroomService._enrollmentsList
            .pipe(
                filter(enrollments => enrollments !== []),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(enrollments => {
                this.enrollments = enrollments;
                const classes = this.enrollments.map(e => e.classrooms[0]);
                this._classroomService
                    .getClassroomById(new Counter(classes).most_common(1)[0][0])
                    .then(
                        data => {
                            this.classroom = data;
                            console.log(data);
                        },
                        error => console.log(error)
                    );
            });
    }

    ngOnChanges(_changes) {
        if (this.matrixes) {
            this.myMatrixes = this.matrixes
                .filter(m => m.owner._id === this.profile._id)
                .map(m => m.discipline.name)
                .join(", ");
        }
    }
}
