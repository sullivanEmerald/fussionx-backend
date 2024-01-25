const predictionsModel = require('../model/prediction')

module.exports = {
    getPredictions : async (req, res) => {
        try {
            const matchPredictions = await predictionsModel.find().lean()        
            if(!matchPredictions){
                res.status(501).json({ msg : 'Internal Server Error'})
            }

            res.status(200).json({ odds : matchPredictions})
        } catch (error) {
            res.status(501).json({ msg : 'Internal Server Error'})
        }
    },

    swapPredictionTeam : async (req, res) => {
        try {
            const {id} = req.params
            const {home, away} = await predictionsModel.findById(id)
            const swapTeams =  await predictionsModel.findByIdAndUpdate(id, {
                home : away,
                away : home
            })

            if(!swapTeams){
                res.status(501).json({ error : 'Internal Server Error'})  
            }

            res.status(200).json({ msg : "successfully updated"})
        } catch (error) {
            console.error(error)
            res.status(501).json({ msg : 'Internal Server Error'})
        }
    }
}