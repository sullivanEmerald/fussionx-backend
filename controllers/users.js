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


    updateUser: async (req, res) => {
        try {
            // Getting form details from the request.
            const { firstname, surname, email, phone } = req.body;
    
            // Getting user ID
            const { id } = req.params;
    
            // Find if there is any user with the same email or phone, excluding the current user
            const existingUser = await userModel.findOne({
                $or: [{ email }, { phone }],
                _id: { $ne: id }
            }).lean();
    
            if (existingUser) {
                if (existingUser.email === email) {
                    return res.status(409).json({ error: 'A user with the email already exists' });
                }
                if (existingUser.phone === phone) {
                    return res.status(409).json({ error: 'A user with the Phone number already exists' });
                }
            }
    
            // Update user record
            const updatedUser = await userModel.findByIdAndUpdate(id, {
                name: firstname,
                surname,
                email,
                phone
            }, { new: true });
    
            if (updatedUser) {
                return res.status(200).json({ msg: 'User Record Successfully Updated' });
            } else {
                return res.status(501).json({ error: 'Internal server error. Check your connection' });
            }
        } catch (error) {
            console.error('Internal server error:', error);
            return res.status(500).json({ error: 'Internal server error' });
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
                return res.status(501).json({ error : 'Image upload failed due to Internal Server Issues'})
            }

            const userImage = await imageCollection.find().lean()
            const sendUserImage = userImage[userImage.length - 1]

           return  res.status(200).json({ msg : 'Profile Picture Sucessfully Updated', profilePic : sendUserImage})

        } catch (error) {
           return res.status(501).json({ error : 'Image upload failed due to Internal Server Issues'})
        }
    },

    updateProfilePhoto: async (req, res) => {
        try {
            const { cloudinaryId } = await imageCollection.findOne({ userId: req.user.id });
    
            const deleteOldImage = await cloudinary.uploader.destroy(cloudinaryId);
    
            // Getting the path of the new image
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path);
    
            if (deleteOldImage) {
                const updateImage = await imageCollection.findOneAndUpdate(
                    { userId: req.user.id },
                    {
                        $set: {
                            image: secure_url,
                            cloudinaryId: public_id
                        }
                    }
                );
    
                if (updateImage) {
                    const userNewImage = await imageCollection.findOne({ userId: req.user.id });
                    return res.status(200).json({ msg: 'Successfully updated profile photo', userNewImage: userNewImage, user : req.user.id});
                }
                return res.status(501).json({ error: 'failed due to network error. check your network strength and try again' });
            }
            return res.status(501).json({ error: 'failed due to network error. check your network strength and try again' });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
 }