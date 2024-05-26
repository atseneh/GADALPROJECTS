const mongoose = require('mongoose')
const {Schema} = mongoose
const notificationSchema = Schema({
    product:{
      type:Schema.Types.ObjectId,
      ref:'Product'
    },
    user:{
      type:Schema.Types.ObjectId,
      ref:'User',
      // required:true
    },
    subscriptionPackage:{
      type:Schema.Types.ObjectId,
      ref:'Package'
    },
  notification:{
    type:String,
    required:true
  },
  seen:{
    type:Boolean,
    default:false
  },
  expired:{
    type:Boolean,
    default:false
  },
  isCampaign:{
    type:Boolean,
    default:false
  }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);