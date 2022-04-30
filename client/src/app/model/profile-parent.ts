import { Profile } from "./profile";

export class ProfileParent extends Profile {
    private kinship: any;
    private childs: any;
    constructor() {
        super();
    }

    /**
     * Getter $kinship
     * @return {any}
     */
    public get $kinship(): any {
        return this.kinship;
    }

    /**
     * Setter $kinship
     * @param {any} value
     */
    public set $kinship(value: any) {
        this.kinship = value;
    }

    /**
     * Getter $childs
     * @return {any}
     */
    public get $childs(): any {
        return this.childs;
    }

    /**
     * Setter $childs
     * @param {any} value
     */
    public set $childs(value: any) {
        this.childs = value;
    }
}
