const express = require('express')
const router = express.Router()
const predictionController =  require('../controllers/predictions')

router.put('/:id', predictionController.swapPredictionTeam)

module.exports =  router