const {RecordStatusEnum,TransactionTypeEnums,EstimationStateEnums} = require('../Utils/enums')
const mongoose = require('mongoose')
const {Schema} = mongoose
const attributeSchema = Schema({
    name:String,
    value:String
})
const estimationSchema = Schema({
title:{
 type:String,
 required:true,
},
description:{
    type:String,
    required:true
},
service:{
type:Number,
// ref:'GadalServiceList',
required:true
},
category:{
    type:Schema.Types.ObjectId,
    ref:'Category'
},
estimationState:{
    type:Number,
    default:1,
    validate:{
      validator:function (value){
      return Object.values(EstimationStateEnums).includes(value)
      },
      message:'Invalid Estimation State value',
    }
  },

  images:{
    type:[String],
    required:[true,'Image Must be Provided'],
  },
  user:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  brand:{
    type:Schema.Types.ObjectId,
    ref:"ProductBrand"
  },
  model:{
    type:Schema.Types.ObjectId,
    ref:"ProductModel"
  },
  attributes:{
    type:[attributeSchema],
    default:[],
  },
  location:{
    type:Schema.Types.ObjectId,
    ref:'Location'
  },
  subCity:{
    type:Schema.Types.ObjectId,
    ref:'SubCity'
  },
  wereda:{
    type:Schema.Types.ObjectId,
    ref:'Wereda'
  },
 
  transactionType:{
    type:Number,
    validate:{
        validator:function(value){
            return Object.values(TransactionTypeEnums).includes(value)
        },
    mesage:"invalid transaction type"
    }
  },
  remark:String,
  recordStatus:{
    type:Number,
    default:1,
    validate:{
        validator:function(value){
            return Object.values(RecordStatusEnum).includes(value)
        },
    mesage:"invalid transaction type"
    }
  },

})
const Estimation = mongoose.model('Estimation',estimationSchema)
module.exports = Estimation