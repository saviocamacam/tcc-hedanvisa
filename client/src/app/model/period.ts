import { Profile } from "./profile";
import { Event } from "./event";

export class Period {
  private _id: String;
  private start: Event;
  private end: Event;
  private owner: Profile;
  private createdBy: Profile;

  constructor() {}

  /**
   * Getter $start
   * @return {Event}
   */
  public get $start(): Event {
    return this.start;
  }

  /**
   * Getter $end
   * @return {Event}
   */
  public get $end(): Event {
    return this.end;
  }

  /**
   * Getter $owner
   * @return {Profile}
   */
  public get $owner(): Profile {
    return this.owner;
  }

  /**
   * Getter $createdBy
   * @return {Profile}
   */
  public get $createdBy(): Profile {
    return this.createdBy;
  }

  /**
   * Setter $start
   * @param {Event} value
   */
  public set $start(value: Event) {
    this.start = value;
  }

  /**
   * Setter $end
   * @param {Event} value
   */
  public set $end(value: Event) {
    this.end = value;
  }

  /**
   * Setter $owner
   * @param {Profile} value
   */
  public set $owner(value: Profile) {
    this.owner = value;
  }

  /**
   * Setter $createdBy
   * @param {Profile} value
   */
  public set $createdBy(value: Profile) {
    this.createdBy = value;
  }

  /**
   * Getter id
   * @return {String}
   */
  public get id(): String {
    return this._id;
  }

  /**
   * Setter id
   * @param {String} value
   */
  public set id(value: String) {
    this._id = value;
  }
}
