import { People } from "./people";

export class Address {
    private _id: string;
    private street: string;
    private number: number;
    private complement: string;
    private block: string;
    private cep: string;
    private county: string;
    private uf: string;
    private peoples: People[];

    constructor() {}

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
     * Getter street
     * @return {string}
     */
    public get $street(): string {
        return this.street;
    }

    /**
     * Setter street
     * @param {string} value
     */
    public set $street(value: string) {
        this.street = value;
    }

    /**
     * Getter number
     * @return {number}
     */
    public get $number(): number {
        return this.number;
    }

    /**
     * Setter number
     * @param {number} value
     */
    public set $number(value: number) {
        this.number = value;
    }

    /**
     * Getter complement
     * @return {string}
     */
    public get $complement(): string {
        return this.complement;
    }

    /**
     * Setter complement
     * @param {string} value
     */
    public set $complement(value: string) {
        this.complement = value;
    }

    /**
     * Getter block
     * @return {string}
     */
    public get $block(): string {
        return this.block;
    }

    /**
     * Setter block
     * @param {string} value
     */
    public set $block(value: string) {
        this.block = value;
    }

    /**
     * Getter cep
     * @return {string}
     */
    public get $cep(): string {
        return this.cep;
    }

    /**
     * Setter cep
     * @param {string} value
     */
    public set $cep(value: string) {
        this.cep = value;
    }

    /**
     * Getter county
     * @return {string}
     */
    public get $county(): string {
        return this.county;
    }

    /**
     * Setter county
     * @param {string} value
     */
    public set $county(value: string) {
        this.county = value;
    }

    /**
     * Getter uf
     * @return {string}
     */
    public get $uf(): string {
        return this.uf;
    }

    /**
     * Setter uf
     * @param {string} value
     */
    public set $uf(value: string) {
        this.uf = value;
    }

    /**
     * Getter peoples
     * @return {People[]}
     */
    public get $peoples(): People[] {
        return this.peoples;
    }

    /**
     * Setter peoples
     * @param {People[]} value
     */
    public set $peoples(value: People[]) {
        this.peoples = value;
    }
}
