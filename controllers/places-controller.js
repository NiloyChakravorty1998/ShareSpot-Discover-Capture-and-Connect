const HttpError = require('../models/http-error');
const {validationResult } = require('express-validator') 
const {getCoordsForAddress} = require('../util/location')
const Place = require('../models/placeSchema')



module.exports = {
    getPlaceById : async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try{
        place = await Place.findById(placeId);
    }catch(error)
    {
        return next( new HttpError('Could not find place with that id', 500 ));
    }
    if(!place)
    {
       return new HttpError('Could not find place with that id', 404 );
    }    
    res.json({ place: place.toObject( { getters: true}) });
    },

    getPlacesByUserId : async(req, res, next) => {
            const userId = req.params.uid;
            let places;
            try{
            places = await Place.find({
                creator: userId
            });
        }catch(error)
        {
            return next(new HttpError('Fetching places with that userId failed', 500));
        }

         res.json({places : places.map(place => place.toObject({ getters: true }))});
    },

    createPlace : async (req, res, next) => {
        const errors = validationResult(req); // check the validation for fields 
        //we mentioned in routes
        if(!errors.isEmpty())
        {
            next(new HttpError('Invalid inputs passed, please check your data'), 422);
        }

        const { title, description,  address, creator } = req.body;
        let coordinates;
        try{
             coordinates = await getCoordsForAddress(address)
        } catch (error)
        {
            return next(error);
        }
        
        const createdPlace = new Place( {
            title,
            description,
            address,
            location: {
                lat: coordinates.lat,
                lng: coordinates.lng
              },
            image:'https://s39023.pcdn.co/wp-content/uploads/2022/10/Where-Are-Those-Morgans-Empire-State-Building-960x720.jpg.webp',
            creator
        }); 

        try{
         await createdPlace.save();
        }
        catch(err)
        {
            return next(new HttpError('Could not save data', 500));
        }
        res.status(201).json({place: createdPlace })
    },

    updatePlaceById : async (req, res, next) => {
        const errors = validationResult(req); // check the validation for fields 
        //we mentioned in routes
        if(!errors.isEmpty())
        {
            console.log(errors);
            throw new ('Invalid user input', 422);
        }
        const { title, description } = req.body;
        const placeId = req.params.pid;
        let place;
         try{
        place = await Place.findById(placeId);
         }catch(error)
        {
        return next( new HttpError('Could not find place with that id', 500 ));
        }
        if(!place)
        {
        return new HttpError('Could not find place with that id', 404 );
        }    
        
        place.title = title;
        place.description =  description;

        try {
            await place.save();
        } catch(error)
        {
            return next(new HttpError('Could not update place', 500));
        }
        res.json( {place : place.toObject({getters : true})});
    },
    deletePlaceById: async (req, res, next) => {
        const placeId = req.params.pid;
      
        try {
          const deletedPlace = await Place.findByIdAndDelete(placeId);
      
          if (!deletedPlace) {
            return next(new HttpError('Could not find place with that id', 404));
          }
      
          res.json({
            message: 'Place deleted successfully',
          });
        } catch (error) {
          return next(new HttpError('Could not delete place with that id', 500));
        }
      }   
}