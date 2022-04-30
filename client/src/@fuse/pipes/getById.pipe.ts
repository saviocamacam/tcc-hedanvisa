import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "getById",
    pure: false
})
export class GetByIdPipe implements PipeTransform {
    /**
     * Transform
     *
     * @param {any[]} value
     * @param {number} id
     * @param {string} property
     * @returns {any}
     */
    transform(value: any[], id: number, property: string): any {
        const foundItem = value.find(item => {
            if (item.id !== undefined) {
                return item.id === id;
            }

            return false;
        });

        if (foundItem) {
            return foundItem[property];
        }
    }
}

@Pipe({
    name: "getByElementId",
    pure: false
})
export class GetElementByIdPipe implements PipeTransform {
    /**
     * Transform
     *
     * @param {any[]} value
     * @param {number} id
     * @returns {any}
     */
    transform(value: any[], id: number): any {
        const foundItem = value.find(item => {
            if (item._id !== undefined) {
                return item._id === id;
            }

            return false;
        });

        if (foundItem) {
            return foundItem;
        } else {
            return { viewValue: "-" };
        }
    }
}

@Pipe({
    name: "getByElementIdUnderscore",
    pure: false
})
export class GetElementByIdUnderscorePipe implements PipeTransform {
    /**
     * Transform
     *
     * @param {any[]} value
     * @param {number} id
     * @returns {any}
     */
    transform(value: any[], id: number): any {
        const o = { viewValue: "-" };
        if (value) {
            const foundItem = value.find(item => {
                if (item.id !== undefined) {
                    return item.id === id;
                }
                return false;
            });

            if (foundItem) {
                return foundItem;
            } else {
                return o;
            }
        } else {
            return o;
        }
    }
}
