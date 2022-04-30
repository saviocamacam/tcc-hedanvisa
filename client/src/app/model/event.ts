import { Profile } from "./profile";

export class Event {
  private _id: String;
  private owner: Profile;
  private start: Date;
  private end: Date;
  private allDay: boolean;
  private invited: Profile[];
  private local: Object;
  constructor() {}

  /**
   * Getter id
   * @return {String}
   */
  public get id(): String {
    return this._id;
  }

  /**
   * Getter $owner
   * @return {Profile}
   */
  public get $owner(): Profile {
    return this.owner;
  }

  /**
   * Getter $start
   * @return {Date}
   */
  public get $start(): Date {
    return this.start;
  }

  /**
   * Getter $end
   * @return {Date}
   */
  public get $end(): Date {
    return this.end;
  }

  /**
   * Getter $allDay
   * @return {boolean}
   */
  public get $allDay(): boolean {
    return this.allDay;
  }

  /**
   * Getter $invited
   * @return {Profile[]}
   */
  public get $invited(): Profile[] {
    return this.invited;
  }

  /**
   * Getter $local
   * @return {Object}
   */
  public get $local(): Object {
    return this.local;
  }

  /**
   * Setter id
   * @param {String} value
   */
  public set id(value: String) {
    this._id = value;
  }

  /**
   * Setter $owner
   * @param {Profile} value
   */
  public set $owner(value: Profile) {
    this.owner = value;
  }

  /**
   * Setter $start
   * @param {Date} value
   */
  public set $start(value: Date) {
    this.start = value;
  }

  /**
   * Setter $end
   * @param {Date} value
   */
  public set $end(value: Date) {
    this.end = value;
  }

  /**
   * Setter $allDay
   * @param {boolean} value
   */
  public set $allDay(value: boolean) {
    this.allDay = value;
  }

  /**
   * Setter $invited
   * @param {Profile[]} value
   */
  public set $invited(value: Profile[]) {
    this.invited = value;
  }

  /**
   * Setter $local
   * @param {Object} value
   */
  public set $local(value: Object) {
    this.local = value;
  }
}
