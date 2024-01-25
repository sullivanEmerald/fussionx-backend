const userModel =  require('../model/User')
const imageCollection =  require('../model/images')
const cloudinary = require('../middleware/cloudinary')


module.exports = {
    getUsers : async (req, res) => {
        try {
            const users = await userModel.find().lean()
            if(!users){
                res.status(501).json({ error : 'Internal Server Error'})
            }
            res.status(200).json({ users : users})
        } catch (error) {
            res.status(501).json({ error : 'Internal Server Error'})
        }
    },


    updateUser : async (req, res) =>{
        try {
            const {name, surname, email, phone} = req.body
            const {id} = req.user
            console.log(id)
            const updateUser = await userModel.findByIdAndUpdate(id, {
                $set : {
                    name : name,
                    surname : surname,
                    email : email,
                    phone : phone
                }
            })

            if(!updateUser){
                res.status(501).json({ error : 'Internal Server Error'}) 
            }

            res.status(200).json({ msg : 'Updated Successfully'})

        } catch (error) {
             res.status(501).json({ error : 'Internal Server Error'}) 
             console.error(error)
        }
    },

    createUserImage : async (req, res) => {
        try {
            const result = await cloudinary.uploader.upload(req.file.path)

            const saveUserImage = await imageCollection.create({
                userId : req.user.id,
                image: result.secure_url,
                cloudinaryId: result.public_id,
            })
            
            if(!saveUserImage){
                res.status(501).json({ error : 'Image upload failed due to Internal Server Issues'})
            }

            const userImage = await imageCollection.find().lean()
            const sendUserImage = userImage[userImage.length - 1]

            res.status(200).json({ msg : 'Profile Picture Sucessfully Updated', profilePic : sendUserImage})
        } catch (error) {
            res.status(501).json({ error : 'Image upload failed due to Internal Server Issues'})
        }
    }
 }