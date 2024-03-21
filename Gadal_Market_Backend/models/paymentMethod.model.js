const mongoose = require('mongoose')
const {Schema} = mongoose
const {RecordStatusEnum,PaymentMethodEnums} = require('../Utils/enums')
const paymentMethodSchema = Schema({
 description:{
    type:String,
    required:true
 },
 accountNumber:{
    type:String,
    required:true
 },
 image:String,
 method:{
     type:Number,
     default:1,
     validate:{
         validator:function (value){
             return Object.values(PaymentMethodEnums).includes(value)
            },
            message:'Invalid payment Method value',
        }
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
},{timestamps:true})
const PaymentMethod = mongoose.model('PaymentMethod',paymentMethodSchema)
module.exports = PaymentMethod