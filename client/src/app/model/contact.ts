import { User } from "./user";
import { Profile } from "./profile";

export class Contact {
    private _id: string;
    private user: String;
    private userAsObject: User;

    private profile: String;
    private profileAsObject: Profile;

    private type: String;
    private checked: boolean;
    private address: string;

    private createdAt: String;
    private updatedAt: String;

    constructor() {}

    /**
     * Getter $user
     * @return {String}
     */
    public get $user(): String {
        return this.user;
    }

    /**
     * Getter $profile
     * @return {String}
     */
    public get $profile(): String {
        return this.profile;
    }

    /**
     * Getter $type
     * @return {String}
     */
    public get $type(): String {
        return this.type;
    }

    /**
     * Setter $user
     * @param {String} value
     */
    public set $user(value: String) {
        this.user = value;
    }

    /**
     * Setter $profile
     * @param {String} value
     */
    public set $profile(value: String) {
        this.profile = value;
    }

    /**
     * Setter $type
     * @param {String} value
     */
    public set $type(value: String) {
        this.type = value;
    }

    /**
     * Getter $createdAt
     * @return {String}
     */
    public get $createdAt(): String {
        return this.createdAt;
    }

    /**
     * Getter $updatedAt
     * @return {String}
     */
    public get $updatedAt(): String {
        return this.updatedAt;
    }

    /**
     * Setter $createdAt
     * @param {String} value
     */
    public set $createdAt(value: String) {
        this.createdAt = value;
    }

    /**
     * Setter $updatedAt
     * @param {String} value
     */
    public set $updatedAt(value: String) {
        this.updatedAt = value;
    }

    /**
     * Getter id
     * @return {string}
     */
    public get id(): string {
        return this._id;
    }

    /**
     * Setter id
     * @param {string} value
     */
    public set id(value: string) {
        this._id = value;
    }

    /**
     * Getter user
     * @return {User}
     */
    public get $userAsObject(): User {
        return this.userAsObject;
    }

    /**
     * Setter id
     * @param {User} value
     */
    public set $userAsObject(value: User) {
        this.userAsObject = value;
    }

    /**
     * Getter profile
     * @return {Profile}
     */
    public get $profileAsObject(): Profile {
        return this.profileAsObject;
    }

    /**
     * Setter profile
     * @param {Profile} value
     */
    public set $profileAsObject(value: Profile) {
        this.profileAsObject = value;
    }

    /**
     * Getter address
     * @return {string}
     */
    public get $address(): string {
        return this.address;
    }

    /**
     * Setter address
     * @param {string} value
     */
    public set $address(value: string) {
        this.address = value;
    }

    /**
     * Getter checked
     * @return {boolean}
     */
    public get $checked(): boolean {
        return this.checked;
    }

    /**
     * Setter checked
     * @param {boolean} value
     */
    public set $checked(value: boolean) {
        this.checked = value;
    }
}
