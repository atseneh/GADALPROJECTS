const mongoose = require('mongoose')
const {Schema} = mongoose
const {RecordStatusEnum} = require('../Utils/enums')
const weredaSchema = Schema({
    descripton:String,
    remark:String,
    subCity:{
    type:Schema.Types.ObjectId,
    ref:'SubCity'
},
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
const Wereda = mongoose.model('Wereda',weredaSchema)
module.exports = Wereda