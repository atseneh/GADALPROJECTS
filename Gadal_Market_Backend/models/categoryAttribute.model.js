const mongoose = require('mongoose')
const {Schema} = mongoose
const {RecordStatusEnum} = require('../Utils/enums')
const categoryAttributesSchema = Schema({
name:String,
isInsertion:Boolean,
category:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:'Category',
},
values:{
    type:[String],
    required:true
},
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
const CategoryAttributes = mongoose.model('CategoryAttributes',categoryAttributesSchema)
module.exports = CategoryAttributes