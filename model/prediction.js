const mongoose =  require('mongoose')

const predictionSchma = new mongoose.Schema({
    home  : {
        type : String,
        required : true
    },


    away  : {
        type : String,
        required : true
    },

    stage : {
        type : String,
        required : true
    },

    prediction  : {
        type : String,
        required : true
    },

    date  : {
        type : String,
        required : true
    },

    time  : {
        type : String,
        required : true
    },

    won  : {
        type : Boolean,
        default : false,
    },
})


module.exports = mongoose.model('Prediction', predictionSchma )