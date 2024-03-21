const mongoose = require('mongoose')
const {Schema} = mongoose
const {RecordStatusEnum,GadalServicesEnums} = require('../Utils/enums')
const categorySchema = Schema({
name:{
 type:String,
 required:true
},
serviceId:{
  type:Number,
  
},
icon:String,
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
const Category = mongoose.model('Category',categorySchema)
module.exports = Category