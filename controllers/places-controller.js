const HttpError = require('../models/http-error');
const {validationResult } = require('express-validator') 

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous skyscrappers  ',
        location: {
            lat: 40.7484,
            lng: -73.9857
        },
        adress: '20 W 34th St., New York, NY 10001, United States',
        creator: 'u1'
    }
];

module.exports = {
    getPlaceById : (req, res, next) => {
        const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });
    if(!place)
    {
        throw new HttpError('Could not find place with that id', 404 );
    }
    res.json({ place })
    },

    getPlacesByUserId : (req, res, next) => {
            const userId = req.params.uid;
            const places = DUMMY_PLACES.filter(p => { //filter gives a new array where the condition matches
                return p.creator === userId;
            });
            if(!places || places.length === 0)
            {
                throw new HttpError('Could not any place with that user id', 404 );
            }
            res.json({places});
    },

    createPlace : (req, res, next) => {
        const errors = validationResult(req); // check the validation for fields 
        //we mentioned in routes
        if(!errors.isEmpty())
        {
            console.log(errors);
            throw new ('Invalid user input', 422);
        }
        const { title, description, coordinates, address, creator } = req.body;
        const createdPlace = {
            id: Date.now().toString(),
            title,
            description,
            location: coordinates,
            address,
            creator 
        };

        DUMMY_PLACES.push(createdPlace);

        res.status(201).json({place: createdPlace })
    },

    updatePlaceById : (req, res, next) => {
        const errors = validationResult(req); // check the validation for fields 
        //we mentioned in routes
        if(!errors.isEmpty())
        {
            console.log(errors);
            throw new ('Invalid user input', 422);
        }
        const { title, description } = req.body;
        const placeId = req.params.pid;

        const updatePlace = {... DUMMY_PLACES.find(p => {  //creates a copy of the object
            return p.id === placeId;
        })};
        const placeIndex = DUMMY_PLACES.findIndex(p => {  
            return p.id === placeId; });
        updatePlace.title = title;
        updatePlace.description =  description;
        
        DUMMY_PLACES[placeIndex] = updatePlace;

        res.json( {place : updatePlace});
    },

    deletePlaceById : (req, res, next) => {
        const placeId = req.params.pid;
        if(DUMMY_PLACES.find(p => p.id === placeId))
        {
            throw new HttpError('Could not find a place for that id', 404);
        }
        const placeIndex = DUMMY_PLACES.findIndex(p => {  
            return p.id === placeId; });
        DUMMY_PLACES.splice(placeIndex,1);
        
        res.json({
            place : DUMMY_PLACES,
            message: 'place is deleted'
        })
    }
}