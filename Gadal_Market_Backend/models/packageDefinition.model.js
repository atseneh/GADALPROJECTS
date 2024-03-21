const mongoose = require('mongoose');
const { Schema } = mongoose;

const packageDefinitionSchema = Schema({
  name: {
    type: String,
    required: true
  },
  numberOfGoldPosts: {
    type: Number,
    required: true
  },
  numberOfBasicPosts: {
    type: Number,
    required: true
  },
  numberOfPremiumPosts: {
    type: Number,
    required: true
  },
  numberOfFreeEstimations: {
    type: Number,
    required: true
  },
  offPercent: {
    type: Number,
    required: true
  }
});

const PackageDefinition = mongoose.model('PackageDefinition', packageDefinitionSchema);
module.exports = PackageDefinition;
