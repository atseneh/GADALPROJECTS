const mongoose = require('mongoose')
const {Schema} = mongoose
const {RecordStatusEnum, OrderStateEnums} = require('../Utils/enums')
const orderSchema = Schema({
 products:{
    type:[Schema.Types.ObjectId],
    required:true
 },
taxAmount:Number,
totalAmount:Number,
date:Date,
engagmentFee:Number,
orderStatus:{
     type:Number,
     default:1,
     validate:{
         validator:function (value){
             return Object.values(OrderStateEnums).includes(value)
            },
            message:'Invalid Order Status value',
        }
},
paymentMethod:{
  type:Schema.Types.ObjectId,
  ref:'PaymentMethod'
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
const Order = mongoose.model('Order',orderSchema)
module.exports = Order