require('dotenv').config(); // Load environment variables first
const geocoder = require('../utils/geocoder');

async function testGeocode() {
  try {
    const res = await geocoder.geocode('Chennai, India');
    console.log('📍 Geocode Result:', res);
  } catch (err) {
    console.error('❌ Geocoding failed:', err);
  }
}

testGeocode();
