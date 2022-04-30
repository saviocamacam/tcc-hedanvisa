import { TableControl } from "../TableControl";

export class ObservationTable extends TableControl {
    private students: any[];

    constructor(private enrollments) {
        super();
    }

    createSimpleTable() {
        this.table = this.students.map(
            ({ no, name, observations, sit_da_matricula }) => {
                if (sit_da_matricula && sit_da_matricula !== "Matriculado") {
                    name = name + " (" + sit_da_matricula.substring(0, 6) + ")";
                }
                return {
                    Nº: no,
                    Aluno: name,
                    Observação: observations.map(o => o.value).join(" ")
                };
            }
        );

        this.columns = Object.keys(this.table[0]).map(key => ({
            name: key,
            label: key
        }));
    }

    modelData(matrixes) {
        this.students = this.enrollments.map(e => ({
            no: e.basic.no,
            cmg: e.basic.cmg,
            name: e.basic.nome_do_aluno,
            sit_da_matricula: e.basic.sit_da_matricula,
            observations: matrixes.map(m => ({
                name: m.discipline.name,
                value: ""
            }))
        }));
    }

    prepare(matrixes) {
        this.modelData(matrixes);
        this.createSimpleTable();
        this.create();
    }
}
