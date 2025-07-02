require('dotenv').config(); // 👈 Add this line FIRST
const geocoder = require('../utils/geocoder');

async function testGeocode() {
  const res = await geocoder.geocode('Chennai, India');
  console.log(res);
}

testGeocode();
