const mongoose = require('mongoose');
const User = require('./User');

const agentSchema = new mongoose.Schema({
  licenseNumber: {
    type: String,
    required: true
  },
  specialties: [String],
  yearsOfExperience: {
    type: Number,
    default: 0
  },
  company: String,
  languages: [String],
  propertiesListed: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  }
});

// Create Agent model as a discriminator of User
const Agent = User.discriminator('Agent', agentSchema);

module.exports = Agent;
