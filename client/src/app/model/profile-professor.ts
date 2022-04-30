import { Profile } from "./profile";
import { Discipline } from "./subject";

export class ProfileProfessor extends Profile {
    private serie: any;
    private school: any;
    private level: any;
    private subjects: Discipline[];
    constructor() {
        super();
    }

    /**
     * Getter $level
     * @return {any}
     */
    public get $level(): any {
        return this.level;
    }

    /**
     * Setter $level
     * @param {any} value
     */
    public set $level(value: any) {
        this.level = value;
    }

    /**
     * Getter $serie
     * @return {any}
     */
    public get $serie(): any {
        return this.serie;
    }

    /**
     * Getter $school
     * @return {any}
     */
    public get $school(): any {
        return this.school;
    }

    /**
     * Setter $serie
     * @param {any} value
     */
    public set $serie(value: any) {
        this.serie = value;
    }

    /**
     * Setter $school
     * @param {any} value
     */
    public set $school(value: any) {
        this.school = value;
    }

    /**
     * Getter $subjects
     * @return {Discipline[]}
     */
    public get $subjects(): Discipline[] {
        return this.subjects;
    }

    /**
     * Setter $subjects
     * @param {Discipline[]} value
     */
    public set $subjects(value: Discipline[]) {
        this.subjects = new Array<Discipline>();
        value.forEach(element => {
            this.subjects.push(new Discipline(element));
        });
    }
}
