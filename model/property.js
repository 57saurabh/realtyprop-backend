const mongoose = require('mongoose');
const { Schema } = mongoose;


const propertySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  transactionType:{
    type:String,
    required:true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  squareFootage: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: [String], 
    required: true,
  },
  agent: {
    name: {
      type: String,
      // required: true,
    },
    phone: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
    },
  },
  images: {
    type: [String], 
    required: true,
  },
  thumbnail: {
    type: String, // URL to the thumbnail image
  },
  featured:{
    type:Boolean
  },
  date:{
    type:Date,
    default:Date.now
  }
});

exports.Property = mongoose.model('Property', propertySchema);

