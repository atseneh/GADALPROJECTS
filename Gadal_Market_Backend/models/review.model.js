 const mongoose = require('mongoose')
 const {ReviewStateEnum,RecordStatusEnum} = require('../Utils/enums')
 const {Schema} = mongoose
 const reviewSchema = Schema({
    description:String,
    stars:Number,
    rate:{
        type:String,
        enum:['Good','Bad','Neutral'],

    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    product:{
        type:Schema.Types.ObjectId,
        ref:'Product'
    },
    status:{
        type:String,
        validate:{
        validator:function(value){
          return Object.values(ReviewStateEnum).includes(value)
        },
        message:'Invalid Review status'
        }
    },
    recordStatus:{
        type:String,
        default:1,
        validate:{
            validator:function(value){
                return Object.values(RecordStatusEnum).includes(value)
            },
        message:'Invalid Record Status value'
        }
    },
    remark:String
 })
 const Review = mongoose.model('Review',reviewSchema)
 module.exports = Review