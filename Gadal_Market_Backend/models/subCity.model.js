const mongoose = require('mongoose')
const {Schema} = mongoose
const {RecordStatusEnum} = require('../Utils/enums')
const subCitySchema = Schema({
    descripton:String,
    remark:String,
    location:{
    type:Schema.Types.ObjectId,
    ref:'Location'
    },
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
const SubCity = mongoose.model('SubCity',subCitySchema)
module.exports = SubCity