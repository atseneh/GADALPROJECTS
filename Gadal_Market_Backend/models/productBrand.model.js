const mongoose = require('mongoose')
const {Schema} = mongoose
const {RecordStatusEnum} = require('../Utils/enums')
const productBrandSchema = Schema({
    description:String,
    service:Number,
    category:{
      type:Schema.Types.ObjectId,
      required:true,
      ref:'Category',
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
const ProductBrand = mongoose.model('ProductBrand',productBrandSchema)
module.exports = ProductBrand