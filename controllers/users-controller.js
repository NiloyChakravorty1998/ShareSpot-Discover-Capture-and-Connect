const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')
const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Niloy chak',
        email: 'test@g.com',
        password: 'test'
    }
];

module.exports = {
    getUsers : (req, res, next) => {
        res.json({users : DUMMY_USERS});
    },

    signup : (req, res, next) => {
        const errors = validationResult(req); // check the validation for fields 
        //we mentioned in routes
        if(!errors.isEmpty())
        {
            console.log(errors);
            throw new ('Invalid user input', 422);
        }
        const {name, email, password} = req.body;
        //check if there's already existing user with email id
        const hasUser = DUMMY_USERS.find( u => u.email === email);
        if(hasUser){
            throw new HttpError('Could not create user, email already exists', 422);
        }else {
        const createdUser = {
            id: Date.now().toString(),
            name,
            email,
            password
        };

        DUMMY_USERS.push(createdUser);

        res.status(201).json({
            user : createdUser
        })
    }
},

    login : (req, res, next) => {
        const {email, password} = req.body;
        const identifiedUser = DUMMY_USERS.find(u => u.email === email);
        if(!identifiedUser || identifiedUser.password !== password)
        {
            throw new HttpError('No such user exists / email or password is wrong', 401);
        }
        res.json({
            message: 'logged in!'
        })
    }
}