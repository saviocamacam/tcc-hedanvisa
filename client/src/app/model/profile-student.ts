import { Profile } from "./profile";

export class ProfileStudent extends Profile {
    private relatives: any;
    private level: any;
    private serie: any;
    private hasSchool: boolean;
    private school: any;

    constructor() {
        super();
    }

    /**
     * Getter $relatives
     * @return {any}
     */
    public get $relatives(): any {
        return this.relatives;
    }

    /**
     * Setter $relatives
     * @param {any} value
     */
    public set $relatives(value: any) {
        this.relatives = value;
    }

    /**
     * Getter $level
     * @return {any}
     */
    public get $level(): any {
        return this.level;
    }

    /**
     * Getter $serie
     * @return {any}
     */
    public get $serie(): any {
        return this.serie;
    }

    /**
     * Setter $level
     * @param {any} value
     */
    public set $level(value: any) {
        this.level = value;
    }

    /**
     * Setter $serie
     * @param {any} value
     */
    public set $serie(value: any) {
        this.serie = value;
    }

    /**
     * Getter $hasSchool
     * @return {boolean}
     */
    public get $hasSchool(): boolean {
        return this.hasSchool;
    }

    /**
     * Setter $hasSchool
     * @param {boolean} value
     */
    public set $hasSchool(value: boolean) {
        this.school = value;
    }

    /**
     * Getter $school
     * @return {any}
     */
    public get $school(): any {
        return this.school;
    }

    /**
     * Setter $school
     * @param {any} value
     */
    public set $school(value: any) {
        this.school = value;
    }
}
