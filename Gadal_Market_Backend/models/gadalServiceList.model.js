const mongoose = require('mongoose')
const {Schema} = mongoose
const {RecordStatusEnum} = require('../Utils/enums')
const GadalServiceListSchema = Schema({
    localId:Number,
    description:String,
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

},
{timestamps:true}
)
const GadalServiceList = mongoose.model('GadalServiceList',GadalServiceListSchema)
module.exports = GadalServiceList