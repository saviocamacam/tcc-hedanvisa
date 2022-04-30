import { TableControl } from "../TableControl";
import StringUtils from "app/utils/string-utils";
import MathUtils from "app/utils/math-utils";

export class SimpleAvaliationTable extends TableControl {
    
    private subjects: any;
    private students: any[];

    public unregistered: Set<string>;

    constructor(private enrollments, private frequencyTable: TableControl) {
        super();
    }

    makeKey(student) {
        const { no, name, sit_da_matricula } = student;
        let label = `${no} - ${StringUtils.title(StringUtils.firstWord(name))}`;
        if (sit_da_matricula && sit_da_matricula !== "Matriculado") {
            label = label + " (" + sit_da_matricula.substring(0, 6) + ")";
        }
        return label;
    }

    calculateMN(subject_idx, type, sufix, category) {
        const sum = (array) => array.filter(v => v !== -1).reduce((curr, next) => curr + next, 0);
        const obj = {
            subject: this.subjects[subject_idx].name,
            category: category,
            avaliation: "M" + sufix,
        };
        return this.students.reduce((obj, student) => {
            const key = this.makeKey(student);
            obj[key] = sum(student.subject[subject_idx][type].map(v => v.value)).toFixed(1);
            return obj;
        }, obj);
    }

    calculateMF(subject_idx) {
        const obj = {
            subject: this.subjects[subject_idx].name,
            category: "Média final",
            avaliation: " ",
        };
        return this.students.reduce((obj, student) => {
            const key = this.makeKey(student);
            const { recuperation, values } = student.subject[subject_idx];
            const value = recuperation.length > 0 ?
                MathUtils.sumArray(recuperation.map(r => r.max).filter(x => x !== -1)) :
                MathUtils.sumArray(values.map(v => v.value).filter(x => x !== -1));
            obj[key] = value.toFixed(1);
            return obj;
        }, obj);
    }

    getFaults() {
        const obj = {
            subject: " ",
            category: "Faltas",
            avaliation: " ",
        };
        return this.students.reduce((obj, student) => {
            const presence = this.frequencyTable.table.find(s => s.cgm === student.cgm);
            const key = this.makeKey(student);
            obj[key] = presence ? presence["Faltas"] : 0;
            return obj;
        }, obj);
    }

    evaluateSubject(i) {
        return [
            this.calculateMN(i, "values", "N", "Avaliações"),
            this.calculateMN(i, "recuperation", "R", "Recuperações"),
            ...this.calculateMF(i),
        ];
    }

    createSimpleTable() {
        if (this.students.length === 0) return;
        this.table = this.subjects.reduce(
            (array, _, i) => [...array, ...this.evaluateSubject(i)], []
        );

        this.table.push(this.getFaults());

        const noLabel = ["subject", "avaliation", "category"]
        this.columns = Object.keys(this.table[0]).map(
            key => ({ name: key, label: noLabel.includes(key) ? "" : key })
        );

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
        this.unregistered = new Set(
            this.enrollments
                .filter(e => e.basic.sit_da_matricula !== "Matriculado")
                .map(e => e.basic.nome_do_aluno)
        );
        
        this.students = this.enrollments.map(e => ({
            no: e.basic.no,
            cgm: e.basic.cgm,
            name: e.basic.nome_do_aluno,
            sit_da_matricula: e.basic.sit_da_matricula,
            subject: matrixes.map(m => ({
                name: m.discipline.name,
                values: m.valuations.map(v => {
                    const val = v.values.find(value => value.enrollment === e._id);
                    const value = val ? val.value * (v.weight / 10) : -1;
                    return { _id: v._id, value };
                }),
                recuperation: m.recoveries.map(r => {
                    const val = r.values.find(value => value.enrollment === e._id);
                    const value = val ? val.value * (r.weight / 10) : -1;
                    return { _id: r._id, value, recoveries: r.valuations };
                }),
            })).map(m => ({
                ...m, recuperation: m.recuperation.map(r => {
                    const sum = MathUtils.sumArray(r.recoveries.map(r => {
                        const { value } = m.values.find(v => v._id === r);
                        return value >= 0 ? value : 0;
                    }));
                    return { ...r, sum, max: Math.max(sum, r.value) };
                })
            }))
        }));

        if (this.students.length > 0) {
            this.subjects = this.students[0].subject;
        }
    }

    prepare(matrixes) {
        this.modelData(matrixes);
        this.createSimpleTable();
        this.defineSpanningColumns();
        this.create();
        this.displayedColumns = [...this.displayedSpans, ...this.displayedColumns];
    }
}