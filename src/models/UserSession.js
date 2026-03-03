const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
  phoneNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  currentStep: { 
    type: String, 
    default: 'ASK_LANGUAGE' 
  },
  language: { 
    type: String, 
    default: 'en' 
  },
  
  // EXPLICIT FIELDS (No confusion for Mongoose)
  name: { type: String, default: "" },         // Null ki jagah Empty String use karenge
  mobile: { type: String, default: "" },
  address: { type: String, default: "" },
  description: { type: String, default: "" },  // Issue yahan aayega
  category: { type: String, default: "" },
  subCategory: { type: String, default: "" },

  lastActive: { 
    type: Date, 
    default: Date.now 
  }
});

userSessionSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

module.exports = mongoose.model('UserSession', userSessionSchema);