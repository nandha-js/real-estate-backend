const NodeGeocoder = require('node-geocoder');

if (!process.env.GEOCODER_PROVIDER || !process.env.GEOCODER_API_KEY) {
  throw new Error('❌ Missing geocoder configuration in .env');
}

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
