const express = require('express')
const session = require('express-session')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const { pool } = require('../database/dbConfig')

const initializePassport = require("../passportConfig")

initializePassport(passport)


//pass to every view:
//is user authenticated or not?
router.use(function(req,res,next){
   res.locals.isAuthenticated = req.isAuthenticated()
   next()
})



// show homepage
// NOTE: may load aggregated data from database
// e.g. amount of groups, users, challenges
router.get('/', async (req, res) => {
   res.render('index')
})

// show about page
router.get('/about', async (req, res) => {
   res.render('about')
})

// show login page
router.get('/login',checkAuthenticated, async (req, res) => {
   res.render('login')
})

// show register page
router.get('/register',checkAuthenticated, async (req, res) => {
   res.render('register')
})

// show user's dashboard with current and archived challenges
router.get('/dashboard',checkNotAuthenticated, async (req, res) => {
   res.render('dashboard',{name:req.user.name})
})

// show challenge overview -> load all possible challenges from the challenge collection
router.get('/challenge-overview',checkNotAuthenticated, async (req, res) => {
   res.render('challenge-overview')
})

// show a specific challenge -> ranking, group members, etc.
// no matter if current or archived
// TODO: transfer username and challenge ID so the challenge can be loaded from the data base
router.get('/challenge-view',checkNotAuthenticated, async (req, res) => {
   res.render('challenge-view',{name:testname})
})

// show invite page to share the challenge with friends
// TODO: when do we create a noe challenge in the data base
// 1) on 'accept challenge' in the challenge-overview page
// 2) on 'send invite' in the share-challenge page
router.get('/share-challenge', async (req, res) => {
   res.render('share-challenge')
})


//Logout route
router.get('/logout', (req,res) => {
   req.logOut()
   req.flash('success_msg','You have logged out')
   res.redirect('/login')
})



// -----------------
// -- POST ROUTES --
// -----------------

//Register:
router.post("/register", async (req, res) => {
   let { name, email, password, passwordControl } = req.body;
 
   if (!name || !email || !password || !passwordControl) {
      req.session.message = {
         type: 'warning',
         message: 'Bitte alle Felder ausfüllen!'
         }
      res.redirect('/register')
   }
 
   else if (password.length < 6) {
      req.session.message = {
         type: 'warning',
         message: 'Das Passwort ist zu kurz!'
         }
      res.redirect('/register')
   }
 
   else if (password !== passwordControl) {
      req.session.message = {
         type: 'warning',
         message: 'Die Passwörter stimmen nicht überein!'
         }
      res.redirect('/register')
   }
 
   else {
      hashedPassword = await bcrypt.hash(password, 10);
      // Validation passed
      pool.query(
        `SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
          if (err) {
            console.log(err);
          }
  
          if (results.rows.length > 0) {
            req.session.message = {
               type: 'warning',
               message: 'Die EMail-Adresse ist bereits registriert!'
               }
            res.redirect('/register')
          } else {
               pool.query(
               `INSERT INTO users (name, email, password)
                     VALUES ($1, $2, $3)
                     RETURNING id, password`,
               [name, email, hashedPassword],
               (err, results) => {
                  if (err) {
                     throw err;
                  }
                  req.session.message = {
                     type: 'success',
                     message: 'Account wurde erfolgreich registriert!'
                     }
                  res.redirect('/login')
               }
               );
          }
        }
      );
    }
  });

  router.post("/login",passport.authenticate('local',{
   successRedirect: '/dashboard',
   failureRedirect: '/login',
   failureFlash: true
   }))

   //redirects user to /dashboard route if he's trying to login again altough he is already logged in.
   function checkAuthenticated(req,res,next){
      if (req.isAuthenticated()){
         return res.redirect('/dashboard')
      }
      next()
   }
   
   //redirects user to /login route if he's trying to access sites that should only be accessed when logged in.
   function checkNotAuthenticated(req,res,next){
      if (req.isAuthenticated()){
         return next()
      }
      
      req.session.message = {
         type: 'warning',
         message: 'Um diese Seite zu sehen, musst du dich zunächst anmelden!'
         }
      res.redirect('/login')
   }

module.exports = router