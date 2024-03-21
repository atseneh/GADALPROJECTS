const mongoose = require('mongoose')
const {Schema} = mongoose
const {RecordStatusEnum} = require('../Utils/enums')
const locationSchema = Schema({
    descripton:String,
    remark:String,
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
const Location = mongoose.model('Location',locationSchema)
module.exports = Location