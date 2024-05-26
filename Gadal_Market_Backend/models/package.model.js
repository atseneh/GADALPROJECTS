const mongoose = require('mongoose');
const { RecordStatusEnum } = require('../Utils/enums');
const { Schema } = mongoose;

const packageSchema = Schema({
  description: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  user: {
    type: [Schema.Types.ObjectId],
    ref: 'User',                         
  },
  remainingGoldPosts:{
    type:Number
  },
  remainingPremiumPosts:{
    type:Number
  },
  remainingBasicPosts:{
    type:Number
  },
  remainingFreeEstimationPosts:{
    type:Number
  },
  packageDefinition: {
    type: Schema.Types.ObjectId,
    ref: 'PackageDefinition'
  },
  transactionReference: String,
  remark: String,
  isValid: Boolean,
  isPayed: Boolean,
  recordStatus: {
    type: Number,
    default: 1,
    validate: {
      validator: function (value) {
        return Object.values(RecordStatusEnum).includes(value);
      },
      message: 'Invalid Status value',
    },
  }
  
});

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;
