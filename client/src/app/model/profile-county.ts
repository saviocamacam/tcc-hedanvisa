import { Profile } from "./profile";

export class ProfileCounty extends Profile {
    county: any;
    role: any;

    constructor() {
        super();
    }

    /**
     * Getter county
     * @return {any}
     */
    public get $county(): any {
        return this.county;
    }

    /**
     * Setter county
     * @param {any} value
     */
    public set $county(value: any) {
        this.county = value;
    }

    /**
     * Getter role
     * @return {any}
     */
    public get $role(): any {
        return this.role;
    }

    /**
     * Setter role
     * @param {any} value
     */
    public set $role(value: any) {
        this.role = value;
    }
}
