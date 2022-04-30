import { TableControl } from "../TableControl";
import DateUtils from "app/utils/date-utils";

export class ContentTable extends TableControl {
    constructor(public enrollments, public period) {
        super();
    }

    getNameFromCgm(cgm: string): string {
        const student = this.enrollments.filter(s => {
            return s.basic.cgm === cgm;
        })[0];
        return student.basic.nome_do_aluno;
    }

    debug(lastLength, newLength) {
        // DEBUG fixo
        console.log("[Content Register]");
        console.log(
            `Quantidade de frequencias computados no intervalo ` +
                `[${this.period.start.start.slice(0, 10)},` +
                `${this.period.end.start.slice(0, 10)}]:`,
            newLength
        );
        console.log("Quantidade anterior:", lastLength);
    }

    generateTable(frequencies) {
        let stringBuilder: string[];
        this.table = [];
        frequencies.forEach(frequency => {
            const date = DateUtils.fastFormat2(frequency.date);
            const teacher = frequency.owner.user.people.name;
            const content = `${frequency.content} [${teacher}]`;

            stringBuilder = [];
            if (frequency.obs) {
                stringBuilder.push(
                    `Observações gerais do dia: "${frequency.obs}"`
                );
            }
            const register = frequency.students[0];
            // Verifica se foi registrado as chamadas
            if (register != null && false) { // !! Ignorado
                Object.keys(register).forEach(cgm => {
                    if (cgm.endsWith("_obs") && register[cgm] != null) {
                        const student = this.getNameFromCgm(
                            cgm.replace("_obs", "")
                        );
                        const obs1 = register[cgm];
                        stringBuilder.push(`${student}: "${obs1}"`);
                    }
                });
            }
            const obs = stringBuilder.join("; ");
            this.table.push({
                Data: date,
                Conteúdos: content,
                Rubrica: "",
                Observações: obs
            });
        });

        // Gerando a table
        this.columns = [];
        Object.keys(this.table[0]).forEach(key => {
            this.columns.push({ name: key, label: key });
        });
    }

    prepare(frequencies) {
        const start = this.period.start.start;
        const end = this.period.end.start;
        const lastLength = frequencies.length;
        const filteredFrequencies = frequencies
            .sort((f1, f2) => DateUtils.compare(f1.date, f2.date))
            .filter(frequency =>
                DateUtils.between(frequency.date, start, end)
            );
        this.debug(lastLength, filteredFrequencies.length);
        if (filteredFrequencies.length == 0) {
            this.table = [];
        } else {
            this.generateTable(filteredFrequencies);
        }
        this.create();
    }
}
