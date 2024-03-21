const mongoose = require('mongoose')
const {Schema} = mongoose
const {RecordStatusEnum} = require('../Utils/enums')
const prdouctModelSchema = Schema({
    description:String,
    category:{
     type:Schema.Types.ObjectId,
     ref:'Category'
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

},
{timestamps:true}
)
const ProductModel = mongoose.model('ProductModel',prdouctModelSchema)
module.exports = ProductModel