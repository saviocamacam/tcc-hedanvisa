const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddressSchema = new Schema(
  {
    street: Schema.Types.String,
    number: Schema.Types.Number,
    complement: Schema.Types.String,
    block: Schema.Types.String,
    cep: Schema.Types.String,
    county: Schema.Types.String,
    uf: Schema.Types.String,
    peoples: [
      {
        type: Schema.Types.ObjectId,
        ref: "People"
      }
    ]
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

module.exports = mongoose.model("Address", AddressSchema);
