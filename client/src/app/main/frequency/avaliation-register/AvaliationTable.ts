import { TableControl } from "../TableControl";
import StringUtils from "app/utils/string-utils";
import MathUtils from "app/utils/math-utils";

export class AvaliationTable extends TableControl {
    public descriptions = [];

    private subjects: any;
    private students: any[];

    public unregistered: Set<string>;
    private WEIGHT_NAME = "Peso";

    constructor(private enrollments, private frequencyTable: TableControl) {
        super();
    }

    makeKey(student) {
        const { no, name, sit_da_matricula } = student;
        let label = `${no} - ${StringUtils.title(StringUtils.firstWord(name))}`;
        if (sit_da_matricula && sit_da_matricula !== "Matriculado") {
            label = label + " (" + sit_da_matricula.substring(0, 6) + ")";
        }
        if (name === this.WEIGHT_NAME) {
            return name;
        } else {
            return label;
        }
    }

    getGrade(i, subject_idx, type, sufix, category) {
        const obj = {
            subject: this.subjects[subject_idx].name,
            category: category,
            avaliation: `${sufix}${i + 1}`
        };
        return this.students.reduce((obj, student) => {
            const key = this.makeKey(student);
            const value = student.subject[subject_idx][type][i].value;
            obj[key] = value === -1 ? "-" : Number(value).toFixed(1);
            return obj;
        }, obj);
    }

    calculateMN(subject_idx, type, sufix, category) {
        const sum = array =>
            array.filter(v => v !== -1).reduce((curr, next) => curr + next, 0);
        const obj = {
            subject: this.subjects[subject_idx].name,
            category: category,
            avaliation: "M" + sufix
        };
        return this.students.reduce((obj, student) => {
            const key = this.makeKey(student);
            obj[key] = sum(
                student.subject[subject_idx][type].map(v => v.value)
            ).toFixed(1);
            return obj;
        }, obj);
    }

    calculateMF(subject_idx) {
        const obj = {
            subject: this.subjects[subject_idx].name,
            category: "Média final",
            avaliation: " "
        };
        return this.students.reduce((obj, student) => {
            const key = this.makeKey(student);
            const { recuperation, values } = student.subject[subject_idx];
            const value =
                recuperation.length > 0
                    ? MathUtils.sumArray(
                          recuperation.map(r => r.max).filter(x => x !== -1)
                      )
                    : MathUtils.sumArray(
                          values.map(v => v.value).filter(x => x !== -1)
                      );
            obj[key] = value.toFixed(1);
            return obj;
        }, obj);
    }

    getFaults() {
        const obj = {
            subject: " ",
            category: "Faltas",
            avaliation: " "
        };
        return this.students.reduce((obj, student) => {
            const presence = this.frequencyTable.table.find(
                s => s.cgm === student.cgm
            );
            const key = this.makeKey(student);
            obj[key] = presence ? presence["Faltas"] : 0;
            return obj;
        }, obj);
    }

    evaluateSubject(i) {
        return [
            ...this.subjects[i].values.map((_, j) =>
                this.getGrade(j, i, "values", "N", "Avaliações")
            ),
            this.calculateMN(i, "values", "N", "Avaliações"),
            ...this.subjects[i].recuperation.map((_, j) =>
                this.getGrade(j, i, "recuperation", "R", "Recuperações")
            ),
            this.calculateMN(i, "recuperation", "R", "Recuperações"),
            ...this.calculateMF(i)
        ];
    }

    createSimpleTable() {
        if (this.students.length === 0) { return; }
        this.table = this.subjects.reduce(
            (array, _, i) => [...array, ...this.evaluateSubject(i)],
            []
        );

        this.table.push(this.getFaults());

        const noLabel = ["subject", "avaliation", "category"];
        this.columns = Object.keys(this.table[0]).map(key => ({
            name: key,
            label: noLabel.includes(key) ? "" : key
        }));

        this.addBlankColumnsUntil(35);
    }

    defineSpanningColumns() {
        this.cacheSpan("category", row => row.category);
        this.cacheSpan("subject", row => row.subject);
        this.displayedSpans = ["subject", "category"];
        this.columns.shift();
        this.columns.shift();
    }

    modelData(matrixes) {
        const weight = {
            no: 0,
            cgm: "0",
            name: this.WEIGHT_NAME,
            subject: matrixes.map(m => ({
                name: m.discipline.name,
                values: m.valuations.map(v => ({ value: v.weight })),
                recuperation: m.recoveries.map(r => ({
                    value: r.weight,
                    max: r.weight
                }))
            }))
        };

        this.unregistered = new Set(
            this.enrollments
                .filter(e => e.basic.sit_da_matricula !== "Matriculado")
                .map(e => e.basic.nome_do_aluno)
        );

        this.descriptions = matrixes.map((m, i) => ({
            discipline: m.discipline.name,
            valuations: m.valuations
                .map((v, i) => `N${i + 1}: ${v.description}`)
                .join(", "),
            recoveries: m.recoveries
                .map((r, i) => `R${i + 1}: ${r.description}`)
                .join(", ")
        }));

        this.students = [
            weight,
            ...this.enrollments.map(e => ({
                no: e.basic.no,
                cgm: e.basic.cgm,
                name: e.basic.nome_do_aluno,
                sit_da_matricula: e.basic.sit_da_matricula,
                subject: matrixes
                    .map(m => ({
                        name: m.discipline.name,
                        values: m.valuations.map(v => {
                            const val = v.values.find(
                                value => value.enrollment === e._id
                            );
                            const value = val
                                ? val.value // val.value * (v.weight / 10)
                                : -1;
                            return { _id: v._id, value };
                        }),
                        recuperation: m.recoveries.map(r => {
                            const val = r.values.find(
                                value => value.enrollment === e._id
                            );
                            const value = val
                                ? val.value // val.value * (r.weight / 10)
                                : -1;
                            return {
                                _id: r._id,
                                value,
                                recoveries: r.valuations
                            };
                        })
                    }))
                    .map(m => ({
                        ...m,
                        recuperation: m.recuperation.map(r => {
                            const sum = MathUtils.sumArray(
                                r.recoveries.map(r => {
                                    const { value } = m.values.find(
                                        v => v._id === r
                                    );
                                    return value >= 0 ? value : 0;
                                })
                            );
                            return { ...r, sum, max: Math.max(sum, r.value) };
                        })
                    }))
            }))
        ];

        if (this.students.length > 0) {
            this.subjects = this.students[0].subject;
        }
    }

    prepare(matrixes) {
        this.modelData(matrixes);
        this.createSimpleTable();
        this.defineSpanningColumns();
        this.create();
        this.displayedColumns = [
            ...this.displayedSpans,
            ...this.displayedColumns
        ];
    }
}
