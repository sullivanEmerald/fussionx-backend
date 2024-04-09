const express = require('express')
const router =  express.Router()
const userController =  require('../controllers/users')
const upload =  require('../middleware/multer')


router.put('/update/:id', userController.updateUser)
router.post('/image', upload.single('profilePicture'), userController.createUserImage)
router.put('/image/update', upload.single('newPhoto'), userController.updateProfilePhoto)



module.exports =  router