import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import { ClassroomService } from "app/main/classroom/classroom.service";
import { takeUntil, filter } from "rxjs/operators";
import { Subject } from "rxjs";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from "@angular/forms";
import { ProfilesService } from "app/services/profiles.service";
import { Profile } from "app/model/profile";
import { SuccessAlertDialogComponent } from "app/main/alerts/success/success.component";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";
import { FrequencyService } from "../frequency.service";

@Component({
    selector: "app-frequency-form",
    templateUrl: "./frequency-form.component.html",
    styleUrls: ["./frequency-form.component.scss"]
})
export class FrequencyFormComponent implements OnInit, OnDestroy {
    frequencyForm: FormGroup;

    getPresence(student) {
        return this.frequencyForm.get(student.basic.cgm);
    }
    getObs(student) {
        return this.frequencyForm.get(student.basic.cgm + "_obs");
    }
    get content() {
        return this.frequencyForm.get("content");
    }
    get date() {
        return this.frequencyForm.get("date");
    }

    defaultsObs = {
        backup: [
            "Ausência não justificada",
            "Ausência por doença",
            "Ausência por vacina",
            "Visita ao dentista",
            "Consulta médica",
            "Necessidade familiar",
            "Viagem"
        ],
        values: []
    };
    dialogTitle: string;
    frequency: any;
    students: any;
    classroom: any;

    profile: Profile;

    presents = [];
    _presents = [];

    private _unsubscribeAll: Subject<any>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<FrequencyFormComponent>,
        private _classroomService: ClassroomService,
        private _formBuilder: FormBuilder,
        private _profilesService: ProfilesService,
        private _matDialog: MatDialog,
        private _frequencyService: FrequencyService
    ) {
        this._unsubscribeAll = new Subject();

        this.frequencyForm = this.createFrequencyForm();
    }

    ngOnInit() {
        this._classroomService
            .currentClassroom()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(classroom => {
                if (classroom) {
                    this.classroom = classroom;
                }
            });

        this._profilesService
            .currentProfile()
            .pipe(
                filter(profile => profile instanceof Profile),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(profile => {
                if (profile) {
                    this.profile = profile;
                }
            });

        if (this.data.action === "new") {
            this.dialogTitle = "Nova Chamada";
        } else if (this.data.action === "edit") {
            this.dialogTitle = "Editar Chamada";
        } else if (this.data.action === "view") {
            this.dialogTitle = "Visualizar Chamada";
        }

        if (this.data.frequency) {
            this.frequency = this.data.frequency;

            this.frequencyForm.controls["owner"].setValue(this.frequency.owner);
            this.frequencyForm.controls["date"].setValue(this.frequency.date);
            this.frequencyForm.controls["content"].setValue(
                this.frequency.content
            );
            this.frequencyForm.controls["obs"].setValue(
                this.frequency.obs
            );
            this.frequencyForm.controls["revisors"].setValue(
                this.frequency.revisors
            );

            if (this.data.frequency.students.length > 0) {
                this.frequencyForm.controls["presents"].setValue(true);
            } else {
                this.frequencyForm.controls["presents"].setValue(false);
            }
            this.getEnrollmentsEdit(this.frequency, this.classroom._id);
        } else {
            this.getEnrollments(this.classroom._id);
        }
    }

    createFrequencyForm(): FormGroup {
        return this._formBuilder.group({
            owner: [null, Validators.required],
            date: [null, Validators.required],
            content: [null, Validators.required],
            obs: [null],
            presents: [true, Validators.required],
            revisors: [null]
        });
    }

    sortStudents() {
        this.students.sort((a, b) => {
            if (a.basic["no"] && b.basic["no"]) {
                if (a.basic["no"] > b.basic["no"]) {
                    return 1;
                }
                if (a.basic["no"] < b.basic["no"]) {
                    return -1;
                }
            }

            return 0;
        });
    }

    getEnrollments(classroomId: any): any {
        this.frequencyForm.controls["owner"].setValue(this.profile.id);

        this._classroomService
            .getEnrollments(classroomId)
            .then(res => {
                const form = this.frequencyForm;
                res.forEach(element => {
                    const { cgm, sit_da_matricula } = element.basic;
                    form.addControl(cgm, new FormControl(true));
                    form.addControl(cgm + "_obs", new FormControl(''));
                    form.addControl(cgm + "_jus", new FormControl(false));

                    if (sit_da_matricula !== "Matriculado") {
                        form.get(cgm).disable();
                        form.get(cgm + "_obs").disable();
                        form.get(cgm + "_jus").disable();
                    }
                });
                this.students = res;
                this.sortStudents();
            })
            .catch(err => {
                console.log(err);
            });
    }

    getEnrollmentsEdit(currentFrequency, classroomId: any): any {
        this._classroomService
            .getEnrollments(classroomId)
            .then(res => {
                const cgms = Object.keys(this.frequency.students);
                if (currentFrequency.students.length === 0) { // Default values
                    res.forEach(element => {
                        const form = this.frequencyForm;
                        const cgm = element.basic.cgm;
                        form.addControl(cgm, new FormControl(true));
                        form.addControl(cgm + "_obs", new FormControl(''));
                        form.addControl(cgm + "_jus", new FormControl(false));
                        if (!cgms.includes(cgm)) {
                            form.get(cgm).disable();
                            form.get(cgm + "_obs").disable();
                            form.get(cgm + "_jus").disable();
                        }
                    });
                } else {
                    const cgms = Object.keys(this.frequency.students[0]);
                    res.forEach(element => {
                        const createForm = (key) => new FormControl(currentFrequency.students[0][key]);
                        const form = this.frequencyForm;
                        const cgm = element.basic.cgm;
                        form.addControl(cgm, createForm(cgm));
                        form.addControl(cgm + "_obs", createForm(cgm + `_obs`));
                        form.addControl(cgm + "_jus", createForm(cgm + "_jus"));
                        if (!cgms.includes(cgm)) {
                            form.get(cgm).disable();
                            form.get(cgm + "_obs").disable();
                            form.get(cgm + "_jus").disable();
                        }
                    });
                }
                this.students = res;
                this.sortStudents();
            })
            .catch(err => {
                console.log(err);
            });
    }

    onKeyup(value, student) {
        this.frequencyForm.controls[student + "_obs"].setValue(value);
    }

    onSubmit() {
        document
            .getElementById("submitButton")
            .setAttribute("disabled", "true");

        if (this.frequency) {
            this.updateFrequency();
        } else {
            this.createFrequency();
        }
    }

    createFrequency() {
        const validFrequencies = JSON.parse(JSON.stringify(this.frequencyForm.value));
        Object.keys(validFrequencies).forEach(key => {
            const cgm = key.replace(/_obs|_jus/, "");
            const control_cgm = this.frequencyForm.get(cgm);
            const control_key = this.frequencyForm.get(key);
            if (control_cgm.disabled) {
                delete validFrequencies[key];
            } else if (key.match("_jus") && !control_key.value) {
                delete validFrequencies[key];
            }
        });

        this._frequencyService
            .setFrequency2(validFrequencies, this.classroom._id)
            .then(frequency => {
                this.frequency = frequency;

                this._matDialog.open(SuccessAlertDialogComponent, {
                    width: "400px",
                    data: {
                        justification: "Frequência criada com sucesso!"
                    }
                });
            })
            .catch(error => {
                console.log(error);
                this._matDialog.open(ErrorAlertDialogComponent, {
                    width: "400px",
                    data: {
                        justification:
                            "Não foi possível criar a frequência no momento."
                    }
                });
            });
    }

    updateFrequency() {
        this._frequencyService
            .updateFrequency(this.frequencyForm.value, this.frequency._id)
            .then(frequency => {
                this.frequency = frequency;

                this._matDialog.open(SuccessAlertDialogComponent, {
                    width: "400px",
                    data: {
                        justification: "Frequência editada com sucesso!"
                    }
                });
            })
            .catch(error => {
                console.log(error);
                this._matDialog.open(ErrorAlertDialogComponent, {
                    width: "400px",
                    data: {
                        justification:
                            "Não foi possível editar a frequência no momento."
                    }
                });
            });
    }

    ngOnDestroy() {
        console.log("FrequencyFormComponent destroyed");

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeDialog() {
        const dialog = this._matDialog.open(FrequencyCheck, {
            width: "250px"
        });

        dialog.afterClosed().subscribe(result => {
            if (result) this.dialogRef.close();
        });
    }

    toggleEnableDisable(student) {
        const presence = this.getPresence(student);
        if (presence.enabled) {
            presence.disable();
            presence.setValue(false);
        } else {
            presence.enable();
            presence.setValue(true);
        }
    }

    onClickTogglePresence(student) {
        if (this.getObs(student).value === '') {
            this.getObs(student).setValue("Ausência não justificada");
        }
    }
}

@Component({
    selector: "frequency-check",
    template: `
        <div class="dialog-content-wrapper">
            <h1
                mat-dialog-title
                class="text-center bold"
                style="font-size: 24px;"
            >
                Você tem certeza que deseja sair?
            </h1>
            <div mat-dialog-content style="color: #d32f2f;">
                <p class="text-center">
                    * Caso você confirme você perderá todo o progresso feito.
                </p>
            </div>
            <div
                mat-dialog-actions
                style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-content: space-between;
    "
            >
                <button
                    mat-button
                    [mat-dialog-close]="true"
                    class="mat-accent-bg"
                >
                    Ok
                </button>
                <button
                    mat-button
                    [mat-dialog-close]="false"
                    class="mat-accent-bg"
                >
                    Cancelar
                </button>
            </div>
        </div>
    `
})
export class FrequencyCheck {
    constructor(public dialogRef: MatDialogRef<FrequencyCheck>) {}
}
