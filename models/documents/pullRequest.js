const mongoose = require('mongoose');

const { Schema } = mongoose;

const PullRequestSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
    // Documento que recebe a sugestão de alteração
    pulled: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    // Documento que origina a sugestão
    pulling: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    // Versão do documento que origina a sugestão
    pullingVersion: {
      type: Schema.Types.Number,
      required: true,
    },
    pulledVersion: {
      type: Schema.Types.Number,
    },
    status: {
      type: mongoose.Schema.Types.String,
      enum: ['waiting', 'accepted', 'denied', 'closed'],
      default: 'waiting',
      required: true,
    },
    why: { type: Schema.Types.String },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
    },
  },
);

module.exports = mongoose.model('PullRequest', PullRequestSchema);
