import { Profile } from "./profile";

export class ProfileSchool extends Profile {
    private role: any;
    private school: any;
    constructor() {
        super();
    }

    /**
     * Getter $role
     * @return {any}
     */
    public get $role(): any {
        return this.role;
    }

    /**
     * Setter $role
     * @param {any} value
     */
    public set $role(value: any) {
        this.role = value;
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
