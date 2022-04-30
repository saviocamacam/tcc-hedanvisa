import { Profile } from "./profile";

export class ProfileSchoolInstitutional extends Profile {
    name: string;
    constructor() {
        super();
    }

    /**
     * Getter $name
     * @return {any}
     */
    public get $name(): any {
        return this.name;
    }

    /**
     * Setter $name
     * @param {any} value
     */
    public set $name(value: any) {
        this.name = value;
    }
}
