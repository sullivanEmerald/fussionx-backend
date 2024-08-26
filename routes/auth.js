const express = require('express')
const router = express.Router()
const authcontroller = require('../controllers/auth')
const predictionController = require('../controllers/predictions')
const usersController =  require('../controllers/users')
const imageController =  require('../controllers/image')
const passport = require('passport');
require('../config/passport')(passport);

router.post('/register', authcontroller.registerUser)
router.post('/login', authcontroller.loginUser )


// route for fetching all predictions, users and all user images
router.get('/predictions', predictionController.getPredictions) 
router.get('/users', usersController.getUsers)
router.get('/profile/images', imageController.getImages)



module.exports =  router