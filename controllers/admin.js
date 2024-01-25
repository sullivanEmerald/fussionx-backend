const predictionModel =  require('../model/prediction')

module.exports = {
    createPrediction  : async (req, res) => {
        try {
            const {hometeam, awayteam, stage, prediction, date, time} = req.body

            const savePrediction =  await predictionModel.create({
                home : hometeam,
                away : awayteam,
                stage : stage,
                prediction : prediction,
                date : date,
                time : time,
            })

            if(!savePrediction){
                res.status(500).json({ error : 'The server encountered server error'})
            }

            const newestPrediction =  await predictionModel.find().lean()
            const Currentprediction = newestPrediction[newestPrediction.length - 1 ]
            
            res.status(200).json({ msg : 'Prediction sucessfully uploaded', loadPrediction : Currentprediction})

        } catch (error) {
            res.status(500).json({ error : 'The server encountered server error'})
        }
    },


    updatePrediction :  async (req, res) => {
        try {
            const {id} = req.params
            const {stage, prediction, date, time} = req.body

            const savePredictionChanges = await predictionModel.findByIdAndUpdate(id, {
                $set : {
                    stage : stage,
                    prediction : prediction, 
                    date : date ,
                    time  : time
                }
            })

            if(!savePredictionChanges){
                res.status(500).json({ error : 'The server encountered server error'})  
            }
            
            res.status(200).json({ msg : 'Prediction Edited Sucessfully'})
        } catch (error) {
            res.status(500).json({ error : 'The server encountered server error'})   
        }
    },  

    deletePrediction : async (req, res) => {
        try {
            const  { id} = req.params

            const deletePrediction = await predictionModel.findByIdAndDelete(id)

            if(!deletePrediction) {
                res.status(500).json({ error : 'The server encountered server error'})   
            }
            res.status(200).json({ msg : 'Prediction deleted Sucessfully'})
        } catch (error) {
            res.status(500).json({ error : 'The server encountered server error'})   
            
        }
    }
}