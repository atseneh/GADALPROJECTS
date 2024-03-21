const mongoose = require('mongoose')
const {Schema} = mongoose
const {RecordStatusEnum} = require('../Utils/enums')
const companyInfoSchema = Schema({
name:String,
tin:String,
phoneNumber:String,
email:String,
address:String,
aboutUs:String,
hotline:String,
faceBookUrl:String,
youtubeUrl:String,
instagramUrl:String,
telegramUrl:String,
twitterUrl:String,
linkedinUrl:String,
tiktokUrl:String,
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
const CompanyInfo = mongoose.model('CompanyInfo',companyInfoSchema)
module.exports = CompanyInfo