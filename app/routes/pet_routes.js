// Express docs: http://expressjs.com/en/api.html
const express = require('express')
const passport = require('passport')

// pull in Mongoose model for examples
const Pet = require('../models/pet')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// ROUTES GO HERE

//INDEX
// GET /pets
router.get('/pets', (req, res, next) => {
	Pet.find()
        .populate('owner')
		.then((pets) => {
			// `examples` will be an array of Mongoose documents
			// we want to convert each one to a POJO, so we use `.map` to
			// apply `.toObject` to each one
			return pets.map((pet) => pet.toObject())
		})
		// respond with status 200 and JSON of the examples
		.then((pets) => res.status(200).json({ pets: pets }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

//SHOW
// GET /pets/:id
router.get('/pets/:id', (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Pet.findById(req.params.id)
        // this populates the owner fields
        .populate('owner')
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "example" JSON
		.then((pet) => res.status(200).json({ pet: pet.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

//CREATE
// CREATE
// POST /examples
router.post('/pets', requireToken, (req, res, next) => {
	// set owner of new example to be current user
	req.body.pet.owner = req.user.id

	Pet.create(req.body.pet)
		// respond to succesful `create` with status 201 and JSON of new "example"
		.then((pet) => {
			res.status(201).json({ pet: pet.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})


//UPDATE

//REMOVE

module.exports = router