export class Hability {
    private _id: String;
    private ano: Array<string>;
    private camposDeAtuacao: String;
    private codigo: String;
    private componente: String;
    private habilidades: String;
    private objetosDeConhecimento: String;
    private praticasDeLinguagem: String;
    /**
     * Constructor
     *
     * @param hability
     */
    constructor(hability) {
        this.id = hability._id;
        this.ano = hability.ano;
        this.camposDeAtuacao = hability.camposDeAtuacao;
        this.codigo = hability.codigo;
        this.componente = hability.componente;
        this.habilidades = hability.habilidades;
        this.objetosDeConhecimento = hability.objetosDeConhecimento;
        this.praticasDeLinguagem = hability.praticasDeLinguagem;
    }

    /**
     * Getter id
     * @return {String}
     */
    public get id(): String {
        return this._id;
    }

    /**
     * Getter $ano
     * @return {Array<string>}
     */
    public get $ano(): Array<string> {
        return this.ano;
    }

    /**
     * Getter $camposDeAtuacao
     * @return {String}
     */
    public get $camposDeAtuacao(): String {
        return this.camposDeAtuacao;
    }

    /**
     * Getter $codigo
     * @return {String}
     */
    public get $codigo(): String {
        return this.codigo;
    }

    /**
     * Getter $componente
     * @return {String}
     */
    public get $componente(): String {
        return this.componente;
    }

    /**
     * Getter $habilidades
     * @return {String}
     */
    public get $habilidades(): String {
        return this.habilidades;
    }

    /**
     * Getter $objetosDeConhecimento
     * @return {String}
     */
    public get $objetosDeConhecimento(): String {
        return this.objetosDeConhecimento;
    }

    /**
     * Getter $praticasDeLinguagem
     * @return {String}
     */
    public get $praticasDeLinguagem(): String {
        return this.praticasDeLinguagem;
    }

    /**
     * Setter id
     * @param {String} value
     */
    public set id(value: String) {
        this._id = value;
    }

    /**
     * Setter $ano
     * @param {Array<string>} value
     */
    public set $ano(value: Array<string>) {
        this.ano = value;
    }

    /**
     * Setter $camposDeAtuacao
     * @param {String} value
     */
    public set $camposDeAtuacao(value: String) {
        this.camposDeAtuacao = value;
    }

    /**
     * Setter $codigo
     * @param {String} value
     */
    public set $codigo(value: String) {
        this.codigo = value;
    }

    /**
     * Setter $componente
     * @param {String} value
     */
    public set $componente(value: String) {
        this.componente = value;
    }

    /**
     * Setter $habilidades
     * @param {String} value
     */
    public set $habilidades(value: String) {
        this.habilidades = value;
    }

    /**
     * Setter $objetosDeConhecimento
     * @param {String} value
     */
    public set $objetosDeConhecimento(value: String) {
        this.objetosDeConhecimento = value;
    }

    /**
     * Setter $praticasDeLinguagem
     * @param {String} value
     */
    public set $praticasDeLinguagem(value: String) {
        this.praticasDeLinguagem = value;
    }
}
