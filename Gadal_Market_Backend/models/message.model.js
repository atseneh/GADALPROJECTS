const mongoose = require('mongoose')
const {Schema} = mongoose
const messageTypeSchema = new Schema({
message:String,
messageType:String
})
const conversationSchema = new Schema({
  message:{
    type:messageTypeSchema,
  }, // could be text voice or image 
  // isFromInterestedParty:Boolean,
  seen:Boolean,
  sender:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  receiver:{
    type:Schema.Types.ObjectId,
    ref:'User'
  }
},{
  timestamps:true
})
const messageSchema = Schema({
    product:{
      type:Schema.Types.ObjectId,
      ref:'Product'
    },
    productOwner:{
      type:Schema.Types.ObjectId,
      ref:'User'
    },
    interestedParty:{
      type:Schema.Types.ObjectId,
      ref:'User'
    },
  conversations:[conversationSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", messageSchema);