const mongoose = require('mongoose');

const { Schema } = mongoose;
const versionHistory = require('mongoose-version-history');
const paginate = require('mongoose-paginate-v2');
// const patchHistory = require('mongoose-patch-history').default;


const DocumentSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
    },
    descriptor: {
      type: Schema.Types.ObjectId,
      ref: 'DocumentDescriptor',
    },
    meta: {
      type: Object,
    },
    content: {
      type: Schema.Types.String,
    },
    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Document',
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'createdAt',
    },
  },
);

DocumentSchema.plugin(versionHistory, { trackDate: true });
// DocumentSchema.plugin(patchHistory, {
//   mongoose,
//   name: 'pullPatches',
//   trackOriginalValue: true,
//   includes: {
//     status: { type: Schema.Types.String },
//     from: { type: Schema.Types.String },
//     why: { type: Schema.Types.String },
//   },
// });
DocumentSchema.plugin(paginate);
module.exports = mongoose.model('Document', DocumentSchema);
