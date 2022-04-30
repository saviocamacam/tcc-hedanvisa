const mongoose = require('mongoose');
const { addFirebaseUserForProfile } = require('../../utils/authService');

const { Schema } = mongoose;

const profileOptions = {
  discriminatorKey: 'profileType',
  timestamps: {
    createdAt: 'createdAt',
  },
};

const ProfileSchema = new Schema(
  {
    news: [
      {
        type: Schema.Types.ObjectId,
        ref: 'News',
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    avatar: {
      type: Schema.Types.String,
      default: 'assets/images/avatars/profile.jpg',
    },
    contacts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Contact',
      },
    ],
    follow: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Follow',
      },
    ],
    documents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Document',
      },
    ],
    bio: {
      type: Schema.Types.String,
      maxlength: 200,
    },
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    active: {
      type: Boolean,
      default: false,
    },
    finishedAt: Date,
  },
  profileOptions,
);

// Antes de adicionar o perfil, cria o usuário no firebase com o mesmo uid.
// Isso foi feito aqui para não precisar repetir o código em cada tipo de perfil
ProfileSchema.pre('save', async function (next) {
  if (this.isNew) {
    await addFirebaseUserForProfile(this._id.toString());
  }
  next();
});

module.exports = mongoose.model('Profile', ProfileSchema);
