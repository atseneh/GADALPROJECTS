const mongoose = require('mongoose')
const {RecordStatusEnum} = require('../Utils/enums')
const {Schema} = mongoose
const currencySchema = Schema({
  description:String,
  remark:String,
  sign:String,
  recordStatus:{
    type:Number,
    default:1,
    validate:{
      validator:function (value){
      return Object.values(RecordStatusEnum).includes(value)
      },
      message:'Invalid Status value',
    }
  }
})
const Currency = mongoose.model('Currency',currencySchema)
module.exports = Currency