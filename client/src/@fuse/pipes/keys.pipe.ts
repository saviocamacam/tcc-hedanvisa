import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "keys" })
export class KeysPipe implements PipeTransform {
    /**
     * Transform
     *
     * @param value
     * @param {string[]} args
     * @returns {any}
     */
    transform(value: any, args: string[]): any {
        const keys: any[] = [];

        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                keys.push({
                    key: key,
                    value: value[key]
                });
            }
        }

        return keys;
    }
}

@Pipe({ name: "defaultKeys" })
export class DefaultKeysPipe implements PipeTransform {
    /**
     * Transform
     *
     * @param value
     * @param {string[]} args
     * @returns {any}
     */
    transform(value: any, args: string[]): any {
        const keys = {
            status: "Estado",
            updatedAt: "Última Atualização",
            createdAt: "Data de Criação",
            waiting: "Aguardando",
            denied: "Negado",
            accepted: "Aceito"
        };

        return keys[value];
    }
}
