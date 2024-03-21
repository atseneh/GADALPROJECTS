const mongoose = require('mongoose');
const { RecordStatusEnum, PrevilageEnums, UserStatusEnums } = require('../Utils/enums');
const { Schema } = mongoose;

const userSchema = Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
  },
  city: {
    type: String,
  },
  subCity: {
    type: String,
  },
  wereda: {
    type: String,
  },
  region: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  followers: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
  },
  following: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
  },
  adminAcessLevel: {
    type: Number,
    validate: {
      validator: function (value) {
        return Object.values(PrevilageEnums).includes(value);
      },
      message: 'Invalid Previlage Value',
    },
  },
  status: {
    type: Number,
    validate: {
      validator: function (value) {
        return Object.values(UserStatusEnums).includes(value);
      },
      message: 'Invalid User Status Value',
    },
  },
  proflePic: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  favourites: {
    type: [Schema.Types.ObjectId],
    ref: 'Product',
  },
  remark: String,
  sign: String,
  recordStatus: {
    type: Number,
    default: 1,
    validate: {
      validator: function (value) {
        return Object.values(RecordStatusEnum).includes(value);
      },
      message: 'Invalid Status value',
    },
  },
  birthDate: {
    type: Date,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
