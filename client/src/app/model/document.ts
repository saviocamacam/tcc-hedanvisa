import { Profile } from "./profile";

export class DocumentModel {
    private _id: string;
    // private type: string;
    private owner: Profile;
    private descriptor: any;
    private meta: Object;
    private content: string;
    private attachments: string[];

    constructor() {}

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get $owner(): Profile {
        return this.owner;
    }

    public set $owner(value: Profile) {
        this.owner = value;
    }

    public get $descriptor(): any {
        return this.descriptor;
    }

    public set $descriptor(value: any) {
        this.descriptor = value;
    }

    public get $meta(): Object {
        return this.meta;
    }

    public set $meta(value: Object) {
        this.meta = value;
    }

    public get $content(): string {
        return this.content;
    }

    public set $content(value: string) {
        this.content = value;
    }

    // public get $type(): string {
    //     return this.type;
    // }

    // public set $type(value: string) {
    //     this.type = value;
    // }

    public get $attachments(): string[] {
        return this.attachments;
    }

    public set $attachments(value: string[]) {
        this.attachments = value;
    }

    public pushAttachment(value: string) {
        this.attachments.push(value);
    }

    public popAttachment() {
        this.attachments.pop();
    }
}
