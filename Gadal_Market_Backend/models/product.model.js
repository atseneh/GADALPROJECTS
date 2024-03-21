const {DerivedProductStateEnums,ProductStateEnums,RecordStatusEnum,TransactionTypeEnums,ProductPostTypeEnums} = require('../Utils/enums')
const mongoose = require('mongoose')
const {Schema} = mongoose
const attributeSchema = Schema({
    name:String,
    value:String
})
const productSchema = Schema({
title:{
 type:String,
 required:true,
},
description:{
    type:String,
    required:true
},
no_day_onTop_cat: {
  type: Number,
  
},
no_day_onTop_home: {
  type: Number,
  
},
no_day_on_Gadal: {
  type: Number,
  
},
productType:{
  type:Number,
  required:true
},
previousPrice:Number,
currentPrice:Number,
category:{
    type:Schema.Types.ObjectId,
    ref:'Category'
},
state:{
    type:Number,
    default:3,
    validate:{
      validator:function (value){
      return Object.values(ProductStateEnums).includes(value)
      },
      message:'Invalid State value',
    }
  },
  postType:{
    type:Number,
    default:3,
    validate:{
      validator:function (value){
      return Object.values(ProductPostTypeEnums).includes(value)
      },
      message:'Invalid Post Type value',
    }
  },
  derivedState:{
    type:Number,
    default:1,
    validate:{
      validator:function (value){
      return Object.values(DerivedProductStateEnums).includes(value)
      },
      message:'Invalid Dervied State value',
    }
  },
  productImages:{
    type:[String],
    required:[true,'Image Must be Provided'],
    validate:{
        validator:function(arr){
            return arr.length >= 1 && arr.length <= 10;
        },
        message: 'You have to provide at least one image and not more than 10 images'
    }
  },
  isFixed:Boolean,
  consignee:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  // container for users who add this product as their favourite
  likedBy:{
    type:[Schema.Types.ObjectId],
    ref:'User'
  },
  viewCount:{
    type:Number,
    default:0,
  },
  currency:{
    type:Schema.Types.ObjectId,
    ref:"Currency"
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
  switch:{
    type:Schema.Types.ObjectId,
    ref:'User'
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
  date: {
    type: Date,
    default: Date.now  
  },
  youtubeLink:String,
  remark:String,
  recordStatus:{
    type:Number,
    validate:{
        validator:function(value){
            return Object.values(RecordStatusEnum).includes(value)
        },
    mesage:"invalid transaction type"
    }
  },

})
const Product = mongoose.model('Product',productSchema)
module.exports = Product