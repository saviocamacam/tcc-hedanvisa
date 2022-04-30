import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    AfterContentInit,
    OnChanges
} from "@angular/core";
import { QuestionsCenterService } from "app/main/questions-database/questions-center/questions-center-service.service";
import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { ProfilesService } from "app/services/profiles.service";
import { PlanningsService } from "app/main/plannings/plannings.service";
import { fuseAnimations } from "@fuse/animations";
import { MatDialog } from "@angular/material";
import { DialogOverviewExampleDialog } from "app/main/plannings/planning-database/planning-list/planning-list.component";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { QuestionsDatabaseService } from "app/main/questions-database/questions-database.service";
import { HttpParams } from "@angular/common/http";
import { ConfirmDeleteDialogComponent } from "app/main/shared-private/confirm-delete-dialog/confirm-delete-dialog.component";
import { Promise } from "bluebird";

import html2canvas from "html2canvas";
import * as jspdf from "jspdf";

import * as pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: "app-questions-list",
    templateUrl: "./questions-list.component.html",
    styleUrls: ["./questions-list.component.scss"],
    animations: fuseAnimations
})
export class QuestionsListComponent
    implements OnInit, OnDestroy, AfterContentInit, OnChanges {
    @Input() view: string; // O que é isto?
    @Input() showAnswers: boolean;
    questions = [];
    disciplines: {}[];
    years: {}[];
    private _unsubscribeAll: Subject<any>;
    profile: any;
    count = 0;
    Object = Object;

    constructor(
        private _questionsCenterService: QuestionsCenterService,
        private _questionsDatabaseService: QuestionsDatabaseService,
        private _profilesService: ProfilesService,
        private _planningsService: PlanningsService,
        public dialog: MatDialog,
        private _fuseProgressBarService: FuseProgressBarService
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnChanges() {
        console.log(this.view);
    }
    ngAfterContentInit(): void {
        // Called after ngOnInit when the component's or directive's content has been initialized.
        // Add 'implements AfterContentInit' to the class.
        console.log(this.view);
    }

    ngOnInit() {
        this._fuseProgressBarService.show();
        this._profilesService
            .currentProfile()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(profile => {
                console.log(profile);
                this.profile = profile;
            });
        this._questionsCenterService.onQuestionsChanged
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(questions => questions !== {})
            )
            .subscribe(res => {
                console.log("GET QUESTIONS ON CHANGED...");
                // console.log(res);
                // this.questions = res.sort((a, b) => {
                //     return a.updatedAt > b.updatedAt ? -1 : 1;
                // });
                this.questions = res;
                this.questions.forEach(el => (el.show = true));
                this._fuseProgressBarService.hide();
            });
        // Subscribe to courses
        this._planningsService.onDisciplinesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(disciplines => {
                // console.log(disciplines);
                this.disciplines = disciplines;
            });
        // Subscribe to courses
        this._planningsService.onYearsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(years => {
                // console.log(years);
                this.years = years;
            });
    }

    ngOnDestroy() {
        console.log("Planning List Component destroyed");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getQuestionYear(year) {
        const value = this.years.find(el => el["id"] === year);
        // console.log(value);

        if (value) {
            return value["viewValue"];
        }
    }

    hide(question) {
        question.show = false;
    }

    getQuestion(question) {
        console.log("GET QUESTION");
        question.expanded = !question.expanded;
        if (question.expanded) {
            this._questionsDatabaseService
                .getQuestion(question._id)
                .then(res => {
                    console.log(res);
                    question.content = res.content;
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    getQuestionTheme(theme) {
        const value = this.disciplines.find(el => el["id"] === theme);
        // console.log(value);
        if (value) {
            return value["viewValue"];
        }
    }

    deleteQuestion(question) {
        this.dialog
            .open(ConfirmDeleteDialogComponent, {
                width: "400px",
                data: {
                    title: "Deseja excluir esta questão?",
                    message: "Essa ação não poderá ser desfeita!"
                }
            })
            .afterClosed()
            .subscribe(response => {
                if (response) {
                    this._questionsDatabaseService
                        .deleteQuestion(question._id)
                        .then(res => {
                            console.log(res);
                            this._questionsCenterService
                                .getQuestions(new HttpParams())
                                .then(res1 => {
                                    console.log();
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        })
                        .catch(err => {
                            console.error(err);
                        });
                }
            });
    }

    openHability(hability) {
        console.log(this.dialog);
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
            maxWidth: "400px",
            data: { key: hability, value: "" }
        });
    }

    onScroll() {
        console.log("scroll.....", this.count);
        this.count++;
    }

    selectedCheck(i, answer): boolean {
        // console.log(i);
        // console.log(answer);
        if (i === 0 && answer === "a") {
            return true;
        } else if (i === 1 && answer === "b") {
            return true;
        } else if (i === 2 && answer === "c") {
            return true;
        } else if (i === 3 && answer === "d") {
            return true;
        } else {
            return false;
        }
    }

    downloadPDF() {
        // this.printDiv("printable");
        // this.printDiv2("printable");
        this.printDiv4("printable");
        // window.print();
    }

    printDiv4(id) {
        const divs = document.getElementsByClassName("fuse-card");
        const newList = [].slice.call(divs);
        const contentArray = [];
        const docDefinition = {
            pageSize: "A4",
            pageMargins: [10, 10, 10, 10],
            content: []
        };

        Promise.map(newList, async (element, index) => {
            const canvas = await html2canvas(element, { scale: 1.5 });
            const imgData = await canvas.toDataURL("image/jpeg");
            console.log("imgData Height => ", element.offsetHeight);
            console.log("imgData Width => ", element.offsetWidth);
            // margin horizontal -40 = removing white spaces
            return (contentArray[`${index}`] = [
                {
                    image: imgData,
                    width: 550
                }
            ]);
        })
            .then(() => docDefinition.content.push(contentArray))
            .then(() => {
                console.log("... starting download ...");
                pdfMake.createPdf(docDefinition).download("examplePdf.pdf");
            });
    }

    printDiv3(id) {
        html2canvas(document.getElementById(id), { scale: 1.5 }).then(
            canvas => {
                const data = canvas.toDataURL();
                const docDefinition = {
                    content: [
                        {
                            image: data,
                            width: 500
                        }
                    ]
                };
                pdfMake.createPdf(docDefinition).download("Score_Details.pdf");
            }
        );
    }

    printDiv2(id) {
        html2canvas(document.getElementById(id), { scale: 1.5 }).then(
            canvas => {
                const imgData = canvas.toDataURL("image/jpeg");

                // console.log('Image URL: ' + imgData);

                const doc = new jspdf("p", "mm", "a4");

                doc.setFontSize(10);
                const imgWidth = 210;
                const pageHeight = 295;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;

                let position = 0;

                doc.addImage(imgData, "jpeg", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(
                        imgData,
                        "jpeg",
                        0,
                        position,
                        imgWidth,
                        imgHeight
                    );
                    heightLeft -= pageHeight;
                }

                doc.save("sample.pdf");
            }
        );
    }
}
