import { Profile } from "./profile";
import { People } from "./people";
import { Contact } from "./contact";
import { ProfileProfessor } from "./profile-professor";
import { ProfileParent } from "./profile-parent";
import { ProfileStudent } from "./profile-student";
import { ProfileSchool } from "./profile-school";
import { ProfileCounty } from "./profile-county";
import { ProfileComunity } from "./profile-comunity";

export class User {
    private _id: number;
    private profiles: String[];
    private profilesAsObject: Profile[] = new Array<Profile>();

    private people: String;
    private peopleAsObject: People;

    private mainProfile: string;
    private shortName: string;

    private mainPhoneAsObject: Contact;
    private mainPhone: String;

    private mainEmailAsObject: Contact;
    private mainEmail: String;
    private supportId: String;

    private createdAt: String;
    private updatedAt: String;

    constructor() {}

    /**
     * Getter $profiles
     * @return {String[]}
     */
    public get $profiles(): String[] {
        return this.profiles;
    }

    /**
     * Getter $profilesAsObject
     * @return {Profile[] }
     */
    public get $profilesAsObject(): Profile[] {
        return this.profilesAsObject;
    }

    /**
     * Getter $peopleA
     * @return {String}
     */
    public get $people(): String {
        return this.people;
    }

    /**
     * Getter $mainPhone
     * @return {String}
     */
    public get $mainPhone(): String {
        return this.mainPhone;
    }

    /**
     * Getter $mainEmail
     * @return {String}
     */
    public get $mainEmail(): String {
        return this.mainEmail;
    }

    /**
     * Getter $supportId
     * @return {String}
     */
    public get $supportId(): String {
        return this.supportId;
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
     * Setter $profiles
     * @param {String[]} value
     */
    public set $profiles(value: String[]) {
        this.profiles = value;
    }

    /**
     * Setter $profilesAsObject
     * @param {Profile[] } value
     */
    public set $profilesAsObject(value: Profile[]) {
        this.profilesAsObject = value;
    }

    /**
     * Setter $peopleA
     * @param {String} value
     */
    public set $people(value: String) {
        this.people = value;
    }

    /**
     * Setter $mainPhone
     * @param {String} value
     */
    public set $mainPhone(value: String) {
        this.mainPhone = value;
    }

    /**
     * Setter $mainEmail
     * @param {String} value
     */
    public set $mainEmail(value: String) {
        this.mainEmail = value;
    }

    /**
     * Setter $supportId
     * @param {String} value
     */
    public set $supportId(value: String) {
        this.supportId = value;
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
     * @return {number}
     */
    public get id(): number {
        return this._id;
    }

    /**
     * Getter $profiles
     * @return {Profile[] }
     */
    public get $profilesAsObjectOld(): Profile[] {
        return this.profilesAsObject;
    }

    /**
     * Getter $people
     * @return {People}
     */
    public get $peopleAsObject(): People {
        return this.peopleAsObject;
    }

    /**
     * Getter $mainProfile
     * @return {string}
     */
    public get $mainProfile(): string {
        return this.mainProfile;
    }

    /**
     * Getter $shortName
     * @return {string}
     */
    public get $shortName(): string {
        return this.shortName;
    }

    /**
     * Getter $mainEmail
     * @return {Contact}
     */
    public get $mainEmailAsObject(): Contact {
        return this.mainEmailAsObject;
    }

    /**
     * Getter $mainPhone
     * @return {Contact}
     */
    public get $mainPhoneAsObject(): Contact {
        return this.mainPhoneAsObject;
    }

    /**
     * Setter id
     * @param {number} value
     */
    public set id(value: number) {
        this._id = value;
    }

    /**
     * Setter $profiles
     * @param {Profile[] } value
     */
    public set $profilesAsObjectOld(value: Profile[]) {
        this.profilesAsObject = new Array<Profile>();
        value.forEach(element => {
            this.profilesAsObject.push(this.getProfileAsObject(element));
        });
    }

    getProfileAsObject(element) {
        let profile;
        switch (element["profileType"]) {
            case "ProfileStudent":
                profile = Object.assign(new ProfileStudent(), element);
                break;
            case "ProfileParent":
                profile = Object.assign(new ProfileParent(), element);
                break;
            case "ProfileProfessor":
                profile = Object.assign(new ProfileProfessor(), element, {
                    subjects: undefined
                });
                profile.$subjects = element["subjects"];
                break;
            case "ProfileSchool":
                profile = Object.assign(new ProfileSchool(), element);
                break;
            case "ProfileCounty":
                profile = Object.assign(new ProfileCounty(), element);
                break;
            case "ProfileComunity":
                profile = Object.assign(new ProfileComunity(), element);
                break;

            default:
                profile = Object.assign(new Profile(), element);
                break;
        }
        return profile;
    }

    /**
     * Setter $people
     * @param {People} value
     */
    public set $peopleAsObject(value: People) {
        this.peopleAsObject = value;
    }

    /**
     * Setter $mainProfile
     * @param {string} value
     */
    public set $mainProfile(value: string) {
        this.mainProfile = value;
    }

    /**
     * Setter $shortName
     * @param {string} value
     */
    public set $shortName(value: string) {
        this.shortName = value;
    }

    /**
     * Setter $mainContact
     * @param {Contact} value
     */
    public set $mainEmailAsObject(value: Contact) {
        this.mainEmailAsObject = value;
    }

    /**
     * Setter $mainPhone
     * @param {Contact} value
     */
    public set $mainPhoneAsObject(value: Contact) {
        this.mainPhoneAsObject = value;
    }

    getMainProfileAsProfile(): Profile {
        const a = this.profilesAsObject.find(profile => {
            return profile.id === this.mainProfile;
        });
        return a;
    }
}
