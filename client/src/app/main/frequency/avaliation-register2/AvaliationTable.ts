import { TableControl } from '../TableControl';

function title(str) {
    return str.toLowerCase().replace(/(^|\s)./g, ch => ch.toUpperCase());
};

function firstWord(str) {
    return str.split(' ', 1)[0];
}

export class AvaliationTable extends TableControl {

    private subjects: any;

    constructor(private students) {
        super();
        this.subjects = students[0].subject;
    }

    makeKey(student) {
        const { no, name } = student;
        return `${no} - ${title(firstWord(name))}`
    }

    getGrade(i, subject_idx, type, sufix) {
        const obj = {
            subject: this.subjects[subject_idx].name, avaliation: `${sufix}${i + 1}`
        };
        return this.students.reduce((obj, student) => {
            const key = this.makeKey(student);
            obj[key] = student.subject[subject_idx][type][i];
            return obj;
        }, obj);
    }

    calculateMN(subject_idx, type, sufix) {
        const sum = (array) => array.reduce((curr, next) => curr + next);
        const obj = {
            subject: this.subjects[subject_idx].name, avaliation: "M" + sufix
        };
        return this.students.reduce((obj, student) => {
            const key = this.makeKey(student);
            obj[key] = sum(student.subject[subject_idx][type])
            return obj;
        }, obj);
    }

    calculateMF(subject_idx, avaliation, recuperation) {
        const obj = {
            subject: this.subjects[subject_idx].name, avaliation: "MF"
        };
        return this.students.reduce((obj, student) => {
            const key = this.makeKey(student);
            obj[key] = Math.max(avaliation[key], recuperation[key]);
            return obj;
        }, obj);
    }

    getFaults(subject_idx) {
        const obj = {
            subject: this.subjects[subject_idx].name, avaliation: "Faltas"
        };
        return this.students.reduce((obj, student) => {
            const key = this.makeKey(student);
            obj[key] = student.subject[subject_idx].faults;
            return obj;
        }, obj);
    }

    evaluateSubject(i) {
        const avaliation = this.calculateMN(i, "values", "N");
        const recuperation = this.calculateMN(i, "recuperation", "R");
        return [
            ...this.subjects[i].values.map((_, j) => this.getGrade(j, i, "values", "N")),
            avaliation,
            ...this.subjects[i].values.map((_, j) => this.getGrade(j, i, "recuperation", "R")),
            recuperation,
            ...this.calculateMF(i, avaliation, recuperation),
            ...this.getFaults(i)
        ];
    }

    createSimpleTable() {
        if (this.students.length === 0) return;

        this.table = this.subjects.reduce((array, _, i) => {
            return [...array, ...this.evaluateSubject(i)];
        }, []);

        const noLabel = ['subject', 'avaliation']
        this.columns = Object.keys(this.table[1]).map(key => {
            return { name: key, label: noLabel.includes(key) ? '' : key };
        });

        this.addBlankColumnsUntil(35);
    }

    defineSpanningColumns() {
        this.cacheSpan("subject", row => row.subject);
        this.displayedSpans = ["subject"];
        this.columns.shift();
    }

    prepare() {
        this.createSimpleTable();
        this.defineSpanningColumns();
        this.create();
        this.displayedColumns = ["subject", ...this.displayedColumns];
    }
}