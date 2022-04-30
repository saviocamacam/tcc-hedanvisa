import { Location } from "@angular/common";
import { Component, OnInit, AfterContentInit } from "@angular/core";

import { ClassroomService } from "app/main/classroom/classroom.service";
import { ProfilesService } from "app/services/profiles.service";
import { SchoolYearService } from "app/services/school-year.service";
import { FrequencyService } from "../frequency.service";
import { EvaluativeMatrixService } from "./evaluative-matrix.service";

import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { FuseConfigService } from "@fuse/services/config.service";

import { FrequencyTable } from "../call-register/FrequencyTable";
import { ContentTable } from "../content-register/ContentTable";
import { AvaliationTable } from "../avaliation-register/AvaliationTable";
import { ObservationTable } from "../avaliation-register-observation/ObservationTable";
import { SimpleAvaliationTable } from "./../avaliation-register-simple/SimpleAvaliationTable";

import Counter from "app/utils/Counter";
import DateUtils from "app/utils/date-utils";
import StringUtils from "app/utils/string-utils";

@Component({
    selector: "app-frequency-report",
    templateUrl: "./frequency-report.component.html",
    styleUrls: ["./frequency-report.component.scss"]
})
export class FrequencyReportComponent implements OnInit, AfterContentInit {
    private enrollments;
    private frequencies;

    public justifications = [];

    private profile;
    public period;

    public contentTable: ContentTable;
    public frequencyTable: FrequencyTable;
    public avaliationTable: AvaliationTable;
    public observationTable: ObservationTable;
    public simpleAvaliationTable: SimpleAvaliationTable;

    public classroom: any;
    public expectedDays: number;
    public effectiveDays: number;

    private myFrequencies; // Cache
    // Controle para impressão pessoal, ou geral.
    public onlyMyCalls: boolean;

    private _unsubscribeAll: Subject<any>;

    public matrixes;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _classroomService: ClassroomService,
        private _frequencyService: FrequencyService,
        private _schoolYearService: SchoolYearService,
        private _evaluativeMatrixService: EvaluativeMatrixService,
        private _profileService: ProfilesService,
        private _location: Location
    ) {
        this._unsubscribeAll = new Subject();
        this.onlyMyCalls = false;
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: { hidden: true },
                toolbar: { hidden: true },
                footer: { hidden: true }
            }
        };
    }

    getMatrixes() {
        if (!this.matrixes && this.classroom && this.period) {
            this._evaluativeMatrixService
                .getEvaluativeMatrixes(this.classroom._id, this.period._id)
                .then(matrix => {
                    this.matrixes = matrix;
                    this.avaliationTable = new AvaliationTable(
                        this.enrollments,
                        this.frequencyTable
                    );
                    this.observationTable = new ObservationTable(
                        this.enrollments
                    );
                    this.simpleAvaliationTable = new SimpleAvaliationTable(
                        this.enrollments,
                        this.frequencyTable
                    );
                    this.avaliationTable.prepare(matrix);
                    this.simpleAvaliationTable.prepare(matrix);
                    this.observationTable.prepare(matrix);
                });
        }
    }

    ngOnInit() {
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
                            this.classroom.course = StringUtils.title(
                                data.course
                            );
                            this.getMatrixes();
                        },
                        error => console.log(error)
                    );
            });

        // Carregando a lista de dias com as frequencias de cada estudante
        this._frequencyService._frequenciesList
            .pipe(
                filter(f => f !== []),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(f => {
                this.frequencies = f;
                this.justifications = this.frequencies
                    .map(it => ({
                        date: it.date,
                        jus: Object.entries(it.students[0] || {})
                            .filter(([key, val]) => key.match("_obs") && val)
                            .map(([key, val]) => [key.replace("_obs", ""), val])
                            .filter(([key, _]) => it.students[0][key + "_jus"])
                            .map(([key, val]) => [
                                this.enrollments.find(e => e.basic.cgm === key),
                                val
                            ])
                            .map(([key, val]) => [key.basic, val])
                    }))
                    .filter(it => it.jus.length > 0)
                    .reduce((arr, it) => {
                        arr.push(
                            ...it.jus.map(([basic, jus]) => ({
                                date: it.date,
                                cgm: basic.cgm,
                                student: basic.nome_do_aluno,
                                jus
                            }))
                        );
                        return arr;
                    }, []);
            });
        // Carregando os dados do periodo
        this._schoolYearService.currentPeriod
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(period => period != null)
            )
            .subscribe(period => {
                this.period = period;
                this.getMatrixes();
            });
        // Obtendo o perfil do usuário atual
        this._profileService
            .currentProfile()
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(profile => profile != null)
            )
            .subscribe(profile => {
                this.profile = profile;
            });
    }

    ngAfterContentInit(): void {
        const { enrollments, period, profile, frequencies } = this;
        const start = period.start.start;
        const end = period.end.start;
        this.expectedDays = DateUtils.intervalUtilsDays(start, end).length;
        this.effectiveDays = this.frequencies
            .filter(f => DateUtils.between(f.date, start, end))
            .map(f => DateUtils.fastFormat2(f.date))
            .filter(unique).length;

        this.frequencyTable = new FrequencyTable(enrollments, period, profile);
        this.contentTable = new ContentTable(enrollments, period);

        this.frequencyTable.prepare(frequencies);
        this.contentTable.prepare(frequencies);
    }

    back() {
        this._location.back();
    }

    downloadPDF() {
        window.print();
    }

    reloadData(matrixes, frequencies) {
        if (this.frequencyTable)
            this.frequencyTable.prepare(frequencies);
        if (this.contentTable)
            this.contentTable.prepare(frequencies);
        if (this.avaliationTable)
            this.avaliationTable.prepare(matrixes);
        if (this.observationTable)
            this.observationTable.prepare(matrixes);
        if (this.simpleAvaliationTable)
            this.simpleAvaliationTable.prepare(matrixes);
    }

    getMyFrequencies() {
        return this.myFrequencies
            ? this.myFrequencies
            : this.frequencies.filter(frequency => {
                  return this.profile._id === frequency.owner._id;
              });
    }

    toggleButtonSplitFrequency(value: boolean) {
        if (this.onlyMyCalls != value) {
            if (value) {
                // Somente chamadas do professor atual
                const myMatrixes = this.matrixes.filter(
                    m => m.owner._id === this.profile._id
                );
                this.myFrequencies = this.getMyFrequencies();
                this.reloadData(myMatrixes, this.myFrequencies);
            } else {
                // Para todos os professores
                this.reloadData(this.matrixes, this.frequencies);
            }
        }
        this.onlyMyCalls = value;
    }
}

function unique(value, index, self): boolean {
    return self.indexOf(value) === index;
}
