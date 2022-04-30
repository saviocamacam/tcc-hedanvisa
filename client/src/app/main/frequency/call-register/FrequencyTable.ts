import { TableControl } from "../TableControl";

import DateUtils from "app/utils/date-utils";

export class FrequencyTable extends TableControl {
    public days: string[];

    public unregistered: Set<string> = new Set<string>();

    constructor(public enrollments, public period, public profile) {
        super();
    }

    createStudentObject(
        num: number,
        name: string,
        cgm: string,
        dates: string[],
        sit_da_matricula: string
    ) {
        return {
            ["Nº"]: num,
            Nome: name,
            ...dates.reduce((obj, date) => ({ ...obj, [date]: " " }), {}),
            ["Nº2"]: num,
            Faltas: 0,
            cgm: cgm,
            sit_da_matricula: sit_da_matricula
        };
    }

    createSimpleTable(frequencies) {
        this.days = this.getDays(frequencies);
        // DEBUG fixo
        console.log("[Call Register]");
        const begin = this.period.start.start.slice(0, 10);
        const end = this.period.end.start.slice(0, 10);
        console.log(
            `Quantidade de dias computados no intervalo [${begin},${end}]:`,
            this.days.length
        );

        // Ordenando pelo número do aluno
        this.enrollments.sort((e1, e2) => e1.basic.no - e2.basic.no);

        // Criando a tabela a partir dos alunos e dos dias
        for (let i = 0; i < this.enrollments.length; i++) {
            let { nome_do_aluno, cgm, sit_da_matricula } = this.enrollments[
                i
            ].basic;
            if (sit_da_matricula && sit_da_matricula !== "Matriculado") {
                nome_do_aluno =
                    nome_do_aluno +
                    " (" +
                    sit_da_matricula.substring(0, 6) +
                    ")";
            }
            this.table.push(
                this.createStudentObject(
                    i + 1,
                    nome_do_aluno,
                    cgm,
                    this.days,
                    sit_da_matricula
                )
            );
        }

        // Criando as colunas para mostrar na tabela
        Object.keys(this.table[0]).forEach(key => {
            this.columns.push({ name: key, label: key });
        });

        // Remove as colunas sit_da_matricula, Faltas, Nº2 e cgm para reposiciona-los.
        this.columns.pop();
        this.columns.pop();
        this.columns.pop();
        this.columns.pop();

        // Adicionando colunas vazias
        // São necessárias 70 colunas para as datas.
        // Existem 2 colunas informativas até aqui, numero, nome
        // Logo são necessárias 72 colunas no total.
        this.addBlankColumnsUntil(72);

        this.columns.push({ name: "Nº2", label: "Nº" });
        this.columns.push({ name: "Faltas", label: "Faltas" });
    }

    processFrequencyDays(frequencies) {
        let warnPresences = false;
        // A regra de negócio atual é se um aluno está presente em uma aula, ele deve
        // receber presença no dia. Se ele faltou mas justificou, a justificativa tem
        // preferência. Esta validação é feita em relação ao fluxo de verificações.
        frequencies.forEach(frequency => {
            const date = DateUtils.fastFormat2(frequency.date);
            const presences = frequency.students[0];
            // Verifica se existe presenças
            if (presences != null) {
                for (let i = 0; i < this.table.length; i++) {
                    const student = this.table[i];
                    const presence = presences[student["cgm"]];
                    // Verifica se o aluno está matriculado
                    if (presence != null) {
                        if (!(this.table[i][date] === "C")) {
                            this.table[i][date] = presence ? "C" : "F";
                        }

                        const justify = presences[student["cgm"] + "_jus"];
                        if (justify) {
                            this.table[i][date] = "J";
                        }
                    } else if (student.sit_da_matricula !== "Matriculado") {
                        this.unregistered.add(student.Nome);
                        this.table[i][date] = "-";
                    }
                }
            } else {
                // DEBUG fixo
                if (!warnPresences) {
                    warnPresences = true;
                    console.warn(`Data de frequencia sem presenças! ${date}`);
                }
            }
        });
    }

    getDays(frequencies) {
        const start = this.period.start.start;
        const end = this.period.end.start;
        return this.days
            ? this.days
            : frequencies
                  .sort((f1, f2) => DateUtils.compare(f1.date, f2.date))
                  .filter(frequency =>
                      DateUtils.between(frequency.date, start, end)
                  )
                  .map(frequency => DateUtils.fastFormat2(frequency.date))
                  .filter(unique);
    }

    addNullLines() {
        for (let i = this.table.length; i < 40; i++) {
            this.table.push(
                this.createStudentObject(i + 1, "", "", this.days, "")
            );
        }
    }

    evaluatePresences() {
        for (let i = 0; i < this.table.length; i++) {
            this.days.forEach(day => {
                this.table[i]["Faltas"] += this.table[i][day] === "F";
            });
        }
    }

    prepare(frequencies) {
        this.createSimpleTable(frequencies);
        this.processFrequencyDays(frequencies);
        this.evaluatePresences();
        this.addNullLines();
        this.create();
    }
}

function unique(value, index, self): boolean {
    return self.indexOf(value) === index;
}
