if(process.env.NODE_ENV !== 'production'){
   require('dotenv').config()
}

/* const PORT = process.env.PORT || 3000 */
const PORT = 3000

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')

const { pool } = require('./database/dbConfig')
const bcrypt = require("bcrypt")
const session = require("express-session")
const flash = require("express-flash")
const passport = require("passport")


app.set('view engine','ejs')
app.set('views',__dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

app.use(express.urlencoded({extended: false}))
app.use(session({
   secret: 'secret',
   resave: false,
   saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


app.use('/', indexRouter)

app.listen(PORT,()=>{
   console.log(`Server running on port ${PORT}`)
})
