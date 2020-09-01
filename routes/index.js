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

   pool.query(
      `SELECT * FROM activity`, (err, results) => {
        if (err) {
          console.log(err);
        }
      res.render('challenge-overview',{
         challenges:results.rows,
         user:req.user
      })
      }
   )
})

// show a specific challenge -> ranking, group members, etc.
// no matter if current or archived
// TODO: transfer username and challenge ID so the challenge can be loaded from the data base
router.get('/challenge-view',checkNotAuthenticated, async (req, res) => {

   //get challenge_id from URL query string
   const challenge_id = req.query.challengeid
   const user_id = req.query.userid


   // ORDER BY used to only show most recent challenge
   pool.query(
      `SELECT * 
      FROM activity
         INNER JOIN ua_rel ON activity.aID = ua_rel.aID
         LEFT JOIN eingabe ON ua_rel.uar_ID = eingabe.uar_ID
      WHERE ua_rel.id=$1 AND activity.aID=$2
      ORDER BY date_end DESC`, [user_id, challenge_id], (err, results) => {
        if (err) {
          console.log(err);
        }   
      console.log(results.rows)
      res.render('challenge-view',
      {
         challenge:results.rows[0],
         user:req.user      
      })
   })
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

   router.post('/challenge/accept', (req,res)=>{
      //read id's from url
      const user_id = req.query.userid
      const challenge_id = req.query.challengeid
      var challenge_duration = 7


      // convert from milliseconds to days
      challenge_duration *= 1000*60*60*24

      //verify that challenge hasn't already been accepted by the user
      pool.query(
         `SELECT id, aid, date_end FROM ua_rel
         WHERE id=$1 AND aid=$2 AND date_end >= NOW()`, [user_id, challenge_id], (err, results) => {
           if (err) {
             console.log(err);
           }
   
           if (results.rows.length > 0) {
             req.session.message = {
                type: 'warning',
                message: 'Die Challenge wurde bereits hinzugefügt!'
                }
             res.redirect('/challenge-overview')
            } else {
               //Add challenge to user (user-activity-relation table)       
               pool.query(
                  `INSERT INTO ua_rel (id, aid, date_start, date_end) 
                     VALUES ($1, $2, (to_timestamp(${Date.now()} / 1000.0)), (to_timestamp(${Date.now()+challenge_duration} / 1000.0)))`,
                        [user_id, challenge_id],
                        (err, results) => {
                           if (err) {
                              throw err;
                           }
                           req.session.message = {
                              type: 'success',
                              message: 'Challenge wurde erfolgreich hinzugefügt!'
                              }
                           res.redirect('/challenge-overview')
                        })   
            }
   })
})
   

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