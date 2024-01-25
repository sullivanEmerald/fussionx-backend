const express =  require('express')
const router = express.Router()
const adminController =  require('../controllers/admin')

router.post('/register', adminController.createPrediction)
router.put('/update/:id' , adminController.updatePrediction)
router.delete('/delete/:id', adminController.deletePrediction)




module.exports = router