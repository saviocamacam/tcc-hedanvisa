import { User } from "./user";
import { DocumentModel } from "./document";

export class Profile {
    private _id: string;
    private createdAt: Date;
    private profileType: string;
    private showType: string;
    private avatar: string;
    private user: User;
    private documents: DocumentModel[];
    private main = false;

    constructor() {}

    /**
     * Getter id
     * @return {string}
     */
    public get id(): string {
        return this._id;
    }

    /**
     * Getter $createdAt
     * @return {Date}
     */
    public get $createdAt(): Date {
        return this.createdAt;
    }

    /**
     * Getter $profileType
     * @return {string}
     */
    public get $profileType(): string {
        return this.profileType;
    }

    /**
     * Getter $showType
     * @return {string}
     */
    public get $showType(): string {
        return this.showType;
    }

    /**
     * Getter $avatar
     * @return {string}
     */
    public get $avatar(): string {
        return this.avatar;
    }

    /**
     * Getter $user
     * @return {User}
     */
    public get $user(): User {
        return this.user;
    }

    /**
     * Getter $main
     * @return {boolean}
     */
    public get $main(): boolean {
        return this.main;
    }

    /**
     * Getter $documents
     * @return {DocumentModel[]}
     */
    public get $documents(): DocumentModel[] {
        return this.documents;
    }

    /**
     * Setter id
     * @param {string} value
     */
    public set id(value: string) {
        this._id = value;
    }

    /**
     * Setter $createdAt
     * @param {Date} value
     */
    public set $createdAt(value: Date) {
        this.createdAt = value;
    }

    /**
     * Setter $profileType
     * @param {string} value
     */
    public set $profileType(value: string) {
        this.profileType = value;
    }

    /**
     * Setter $showType
     * @param {string} value
     */
    public set $showType(value: string) {
        this.showType = value;
    }

    /**
     * Setter $avatar
     * @param {string} value
     */
    public set $avatar(value: string) {
        this.avatar = value;
    }

    /**
     * Setter $main
     * @param {boolean} value
     */
    public set $main(value: boolean) {
        this.main = value;
    }

    /**
     * Setter $documents
     * @param {DocumentModel[]} value
     */
    public set $documents(value) {
        this.documents = value;
    }
}
