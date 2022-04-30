import { SchoolYear } from "./school-year";
import { ProfileSchoolInstitutional } from "./profile-school-institutional";
import { ProfileSchool } from "./profile-school";
import { Event } from "./event";

export class SchoolYearClassroom {
    private _id: string;
    private schoolYear: SchoolYear;
    private school: ProfileSchoolInstitutional;
    private createdBy: ProfileSchool;
    private classrooms: any[];
    private events: Event[];
    private attachments: any[];

    constructor() {}

    /**
     * Getter id
     * @return {string}
     */
    public get id(): string {
        return this._id;
    }

    /**
     * Getter $schoolYear
     * @return {SchoolYear}
     */
    public get $schoolYear(): SchoolYear {
        return this.schoolYear;
    }

    /**
     * Getter school
     * @return {ProfileSchoolInstitutional}
     */
    public get $school(): ProfileSchoolInstitutional {
        return this.school;
    }

    /**
     * Getter $createdBy
     * @return {ProfileSchool}
     */
    public get $createdBy(): ProfileSchool {
        return this.createdBy;
    }

    /**
     * Getter classrooms
     * @return {any}
     */
    public get $classrooms(): any[] {
        return this.classrooms;
    }

    /**
     * Getter $events
     * @return {Event[]}
     */
    public get $events(): Event[] {
        return this.events;
    }

    /**
     * Getter $attachments
     * @return {any[]}
     */
    public get $attachments(): any[] {
        return this.attachments;
    }

    /**
     * Setter id
     * @param {string} value
     */
    public set id(value: string) {
        this._id = value;
    }

    /**
     * Setter $schoolYear
     * @param {SchoolYear} value
     */
    public set $schoolYear(value: SchoolYear) {
        this.schoolYear = value;
    }

    /**
     * Setter $school
     * @param {ProfileSchoolInstitutional} value
     */
    public set $school(value: ProfileSchoolInstitutional) {
        this.school = value;
    }

    /**
     * Setter $createdBy
     * @param {ProfileSchool} value
     */
    public set $createdBy(value: ProfileSchool) {
        this.createdBy = value;
    }

    /**
     * Setter $classrooms
     * @param {any[]} value
     */
    public set $classrooms(value: any[]) {
        this.classrooms = value;
    }

    /**
     * Setter $events
     * @param {Event[]} value
     */
    public set $events(value: Event[]) {
        this.events = value;
    }

    /**
     * Setter $attachments
     * @param {any[]} value
     */
    public set $attachments(value: any[]) {
        this.attachments = value;
    }
}
