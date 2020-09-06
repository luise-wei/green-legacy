if(process.env.NODE_ENV !== 'production'){
   require('dotenv').config()
}

/* const PORT = 3000 */
const PORT = process.env.PORT || 3000

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')

const { pool } = require('./database/dbConfig')
const bcrypt = require("bcrypt")
const session = require("express-session")
const flash = require("express-flash")
const passport = require("passport")
// const cors = require('cors');

const app = express()

app.set('view engine','ejs')
app.set('views',__dirname + '/views')
app.set('layout','layouts/layout')

app.use(expressLayouts)
app.use(express.static('public'))

app.use(express.urlencoded({extended: false}))
app.use(session({
   secret: process.env.SECRET,
   resave: false,
   saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//middleware for deleting session message
app.use((req, res, next)=>{
   res.locals.message = req.session.message
   delete req.session.message
   next()
 })

// for using ressources from different servers (or ports on same server)
// app.use(cors({
//    origin: "http://localhost:3000"
// }));

// NOTE: may be necessary for data exchange while under localhost
// app.use(function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//    next();
//  });

app.use('/', indexRouter)

app.listen(PORT,()=>{
   console.log(`Server running on port ${PORT}`, process.env.SECRET)
})