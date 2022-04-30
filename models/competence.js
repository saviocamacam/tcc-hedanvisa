var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FundamentalCompetenceSchema = new Schema({
    componente: Schema.Types.String,
    ano:[Schema.Types.String],
    unidadesTematicas: Schema.Types.String,
    camposDeAtuacao: Schema.Types.String,
    praticasDeLinguagem: Schema.Types.String,
    objetosDeConhecimento: Schema.Types.String,
    habilidades: Schema.Types.String
});

var InfantCompetenceSchema = new Schema({
    campoDeExperiencias: Schema.Types.String,
    faixasEtarias:Schema.Types.String,
    codigo: Schema.Types.String,
    objetivosDeAprendizagemEDesenvolvimento: Schema.Types.String
});

module.exports = {
    fundamental: mongoose.model("FundamentalCompetence", FundamentalCompetenceSchema),
    infant: mongoose.model("InfantCompetence", InfantCompetenceSchema)
};