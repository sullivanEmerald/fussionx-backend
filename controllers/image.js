const imageCollection =  require('../model/images')

module.exports = {
    getImages : async (req, res) => {
        try {
            const allImages = await imageCollection.find().lean()
            if(!allImages){
                res.status(501).json({ error : 'Netork error'})
            }

            res.status(200).json({ msg : 'all found', images : allImages})
        } catch (error) {
            console.error(error)
        }
    }
}