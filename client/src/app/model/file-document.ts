export class FileDocument {
    private owner: any;
    private filename: any;
    private filetype: any;
    private hashname: any;

    constructor() {}

    /**
     * get $owner
     * @return {any}
     */
    public get $owner(): any {
        return this.owner;
    }

    /**
     * set $owner
     * @param {any} value
     */
    public set $owner(value: any) {
        this.owner = value;
    }

    /**
     * get $filename
     * @return {any}
     */
    public get $filename(): any {
        return this.filename;
    }

    /**
     * set $filename
     * @param {any} value
     */
    public set $filename(value: any) {
        this.filename = value;
    }

    /**
     * get $filetype
     * @return {any}
     */
    public get $filetype(): any {
        return this.filetype;
    }

    /**
     * set $filetype
     * @param {any} value
     */
    public set $filetype(value: any) {
        this.filetype = value;
    }

    /**
     * get $hashname
     * @return {any}
     */
    public get $hashname(): any {
        return this.hashname;
    }

    /**
     * public set $hashname
     * @param {any} value
     */
    public set $hashname(value: any) {
        this.hashname = value;
    }
}
