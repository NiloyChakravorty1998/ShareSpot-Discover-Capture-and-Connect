const dotenv = require('dotenv').config();
const API_KEY = process.env.API_KEY;
const axios = require('axios')
const  HttpError = require('../models/http-error')

module.exports = {
    getCoordsForAddress : async (address) => {
      const response = await  axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)}&key=${API_KEY}`);
        const data = response.data;
        if(!data || data.status === 'ZERO_RESULTS')
        {
            throw new HttpError('Could not find location for the specidfied address', 422);
        }

        const coordinates = data.results[0].geometry.location;
        console.log(coordinates);
        return coordinates;
    }
}