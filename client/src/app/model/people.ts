import { Address } from "./address";

export class People {
    private _id: string;
    private name: string;
    private user: string;
    private address: Address;
    private born: Date;
    private cpf: string;
    private rg: string;
    private rg_uf: string;
    private gender: string;

    constructor() {}

    /**
     * Getter id
     * @return {string}
     */
    public get id(): string {
        return this._id;
    }

    /**
     * Getter $name
     * @return {string}
     */
    public get $name(): string {
        return this.name;
    }

    /**
     * Getter $user
     * @return {string}
     */
    public get $user(): string {
        return this.user;
    }

    /**
     * Getter $address
     * @return {Address}
     */
    public get $address(): Address {
        return this.address;
    }

    /**
     * Getter $born
     * @return {Date}
     */
    public get $born(): Date {
        return this.born;
    }

    /**
     * Getter $cpf
     * @return {string}
     */
    public get $cpf(): string {
        return this.cpf;
    }

    /**
     * Getter $rg
     * @return {string}
     */
    public get $rg(): string {
        return this.rg;
    }

    /**
     * Getter $rg_uf
     * @return {string}
     */
    public get $rg_uf(): string {
        return this.rg_uf;
    }

    /**
     * Getter $gender
     * @return {string}
     */
    public get $gender(): string {
        return this.gender;
    }

    /**
     * Setter id
     * @param {string} value
     */
    public set id(value: string) {
        this._id = value;
    }

    /**
     * Setter $name
     * @param {string} value
     */
    public set $name(value: string) {
        this.name = value;
    }

    /**
     * Setter $user
     * @param {string} value
     */
    public set $user(value: string) {
        this.user = value;
    }

    /**
     * Setter $address
     * @param {Address} value
     */
    public set $address(value: Address) {
        this.address = value;
    }

    /**
     * Setter $born
     * @param {Date} value
     */
    public set $born(value: Date) {
        this.born = value;
    }

    /**
     * Setter $cpf
     * @param {string} value
     */
    public set $cpf(value: string) {
        this.cpf = value;
    }

    /**
     * Setter $rg
     * @param {string} value
     */
    public set $rg(value: string) {
        this.rg = value;
    }

    /**
     * Setter $rg_uf
     * @param {string} value
     */
    public set $rg_uf(value: string) {
        this.rg_uf = value;
    }

    /**
     * Setter $gender
     * @param {string} value
     */
    public set $gender(value: string) {
        this.gender = value;
    }
}
