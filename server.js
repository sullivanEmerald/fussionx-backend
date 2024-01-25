const express = require('express')
const app =  express()
const logger =  require('morgan')
const cors = require('cors')
const passport = require('passport')
const session =  require('express-session')
const MongoStore =  require('connect-mongo')
const mongoose  = require('mongoose')
const connectDB = require('./config/database')
const mainroutes =  require('./routes/auth')
const adminRoute =  require('./routes/admin')
const predictionRoute =  require('./routes/prediction')
const usersRouter =  require('./routes/users')



// connecting with my environment variables
require('dotenv').config({ path: './config/.env'})



require('./config/passport')(passport)



// calling DBASE function
connectDB()


console.log(process.env.PORT)


// setting global middlewares
app.use(express.urlencoded({extended :true}))
app.use(express.json())
app.use(cors())
app.use(logger('dev'))


// initializing session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_STRING, 
        mongooseConnection: mongoose.connection, 
    })
}));


app.use(passport.initialize())
app.use(passport.session())


// ROUTES
app.use('/', mainroutes)
app.use('/admin' , adminRoute)
app.use('/prediction', predictionRoute)
app.use('/users', usersRouter)


app.listen(2000,() => {
    console.log(`app is runnig on ${process.env.PORT}`)
})