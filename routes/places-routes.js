const express = require('express');
const {check} = require('express-validator')
const router = express.Router();
const {getPlaceById, getPlacesByUserId, createPlace, updatePlaceById, deletePlaceById} = require('../controllers/places-controller')


router.get('/:pid',getPlaceById)
router.get('/user/:uid',getPlacesByUserId)

router.post('/',[
    check('title').not().isEmpty(),
    check('description').isLength({min:5}),
    check('address').not().isEmpty(),
], createPlace) // we are calling check like an array
// middleware to ensure that the data so entered by users is not empty
router.patch('/:pid',[
    check('title').not().isEmpty(),
    check('description').isLength({min:5})
], updatePlaceById)

router.delete('/:pid', deletePlaceById)

module.exports = router;