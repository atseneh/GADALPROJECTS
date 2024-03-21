const mongoose = require('mongoose')
const {Schema} = mongoose
const {RecordStatusEnum} = require('../Utils/enums')
const engagmentPriceSchema = Schema({
    price:Number,
    service:{
     type:Schema.Types.ObjectId,
     ref:'GadalServiceList'
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

},
{timestamps:true}
)
const EngagmentPrice = mongoose.model('EngagmentPrice',engagmentPriceSchema)
module.exports = EngagmentPrice