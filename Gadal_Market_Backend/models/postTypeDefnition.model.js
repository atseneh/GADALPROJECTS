const mongoose = require('mongoose');
const { Schema } = mongoose;

const postTypeDefinitionSchema = Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  no_day_onTop_cat: {
    type: Number,
    required: true
  },
  no_day_onTop_home: {
    type: Number,
    required: true
  },
  no_day_on_Gadal: {
    type: Number,
    required: true
  }
});

const PostTypeDefinition = mongoose.model('postTypeDefinition', postTypeDefinitionSchema);
module.exports = PostTypeDefinition;
