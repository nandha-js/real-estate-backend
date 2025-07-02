const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description']
    },
    price: {
      type: Number,
      required: [true, 'Please add a price']
    },
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere'
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    },
    propertyType: {
      type: String,
      enum: ['Apartment', 'House', 'Villa', 'Condo', 'Townhouse', 'Land'],
      required: true
    },
    bedrooms: {
      type: Number,
      required: true
    },
    bathrooms: {
      type: Number,
      required: true
    },
    area: {
      type: Number,
      required: [true, 'Please add the area in sqft']
    },
    amenities: [String],
    images: [
      {
        url: String,
        public_id: String
      }
    ],
    isFeatured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['For Sale', 'For Rent', 'Sold'],
      default: 'For Sale'
    },
    agent: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Reverse populate with virtuals
propertySchema.virtual('inquiries', {
  ref: 'Inquiry',
  localField: '_id',
  foreignField: 'property',
  justOne: false
});

// Geocode & create location field before save
propertySchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);
  if (loc.length) {
    this.location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
      street: loc[0].streetName,
      city: loc[0].city,
      state: loc[0].stateCode,
      zipcode: loc[0].zipcode,
      country: loc[0].countryCode
    };
    this.address = undefined; // Don't store raw address
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);
