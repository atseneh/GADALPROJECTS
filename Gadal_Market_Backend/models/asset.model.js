const mongoose = require('mongoose')
const {Schema} = mongoose
const {RecordStatusEnum,AssetEnums} = require('../Utils/enums')
const assetSchema = Schema({
 description:String,
 filePath:{
  type:[String]
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
  },
  assetType:{
    type:Number,
    validate:{
      validator:function (value){
      return Object.values(AssetEnums).includes(value)
      },
      message:'Invalid Asset Type',
    }
  }
})
const Assets = mongoose.model('Assets',assetSchema)
module.exports = Assets