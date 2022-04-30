export class Discipline {
    private _id: any;
    private value: any;
    private viewValue: any;

    constructor(value: any) {
        this.value = value;
    }

    /**
     * Getter id
     * @return {any}
     */
    public get id(): any {
        return this._id;
    }

    /**
     * Getter $value
     * @return {any}
     */
    public get $value(): any {
        return this.value;
    }

    /**
     * Getter $viewValue
     * @return {any}
     */
    public get $viewValue(): any {
        return this.viewValue;
    }

    /**
     * Setter id
     * @param {any} value
     */
    public set id(value: any) {
        this._id = value;
    }

    /**
     * Setter $value
     * @param {any} value
     */
    public set $value(value: any) {
        this.value = value;
    }

    /**
     * Setter $viewValue
     * @param {any} value
     */
    public set $viewValue(value: any) {
        this.viewValue = value;
    }
}
