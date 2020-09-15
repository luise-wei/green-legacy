const express = require('express')
const session = require('express-session')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const { pool } = require('../database/dbConfig')
const DATE_FORMATER = require( 'dateformat' );
const dbQuery_Challenges = require('../database/models/Challenges.js')
const dbQuery_Dashboard = require('../database/models/Dashboard.js')
const dbQuery_ChallengeView = require('../database/models/Challenge-View.js')

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
   var user_id = req.user.uid

   //get data for tiles
   var numSolvedChallenges = await dbQuery_Dashboard.numSolvedChallenges(user_id)
   var favChallenge = await dbQuery_Dashboard.favoriteChallenge(user_id)

   //get current and completed challenges
   var currentChallenges = await dbQuery_Dashboard.getCurrentChallenges(user_id)
   var completedChallenges = await dbQuery_Dashboard.getCompletedChallenges(user_id)

   // TODO: request all current and past challenges of the current user
   result = {  current:[
                  {        
                     challengeid: 3,
                     challengeName: "VeggieDay",
                     startDate: DATE_FORMATER( new Date(), "2020-09-9"),
                     endDate: DATE_FORMATER( new Date(), "2020-09-16"),
                     goal: 4,
                     icon:"fas fa-carrot"
                  },  
                  {        
                     challengeid: 2,
                     challengeName: "RideBike",
                     startDate: DATE_FORMATER( new Date(), "2020-09-6"),
                     endDate: DATE_FORMATER( new Date(), "2020-09-13"),
                     goal: 1,                     
                     icon:"fas fa-bicycle"
                  }           
               ],
               past:[
                  {   
                     challengeid: 1,     
                     challengeName: "VeggieDay",
                     startDate: DATE_FORMATER( new Date(), "2020-08-4"),
                     endDate: DATE_FORMATER( new Date(), "2020-08-11"),
                     goal: 3,                     
                     icon:"fas fa-carrot"
                  } 
               ],
               favourite: { 
                  aid: favChallenge.aid,     
                  aname: favChallenge.aname,
                  count: favChallenge.count
               },
               numSolvedChallenges: numSolvedChallenges,
               savedCO2: 12,
               user:req.user 
            }

   res.render('dashboard',{
      name:req.user.name, result:result, 
      currentChallenges:currentChallenges, completedChallenges:completedChallenges
   })

   // TODO: if click on "to challenge" the app is redirected to the specific challenge-view
})

// show challenge overview -> load all possible challenges from the challenge collection
router.get('/challenge-overview',checkNotAuthenticated, async (req, res) => {   

   var challenges = await dbQuery_Challenges.getChallengesForChallengeOverview()

   res.render('challenge-overview',{
      challenges:challenges,
      user:req.user
   })
})

// show a specific challenge -> ranking, group members, etc.
// no matter if current or archived
// TODO: transfer username and challenge ID so the challenge can be loaded from the data base
router.get('/challenge-view',checkNotAuthenticated, async (req, res) => {

   //get params from query string
   const ucr_id = req.query.ucr_id

   const challengeData = await dbQuery_ChallengeView.getChallengeInfoForChallengeView(ucr_id)

   const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
   const start = new Date("2020-09-9")
   const end = new Date("2020-09-16")
   const today = new Date()
   const diffTime = Math.abs(end - today);
   const difference = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
   result = {  info:{        
                     challengeid: 3,
                     challengeName: "VeggieDay",
                     startDate:  start.toLocaleDateString("en-GB"),
                     endDate: end.toLocaleDateString("en-GB"),
                     unit: "Tage",
                     goal: 4,
                     daysLeft: difference,
                     icon:"fas fa-carrot"
               },
               entries:[
                  {   
                     date: DATE_FORMATER( new Date(), "2020-09-09"),
                     value: 1,
                  }, 
                  {   
                     date: DATE_FORMATER( new Date(), "2020-09-11"),
                     value: 1,
                  }, 
                  {   
                     date: DATE_FORMATER( new Date(), "2020-09-12"),
                     value: 1,
                  } 
               ],
               progress: {
                  sum: 3, // sum of all values in entries
                  percentage: 100 * 3/4 // progress in percent   
               },
               user:req.user 
   }

   res.render('challenge-view',{
      challenge:result,
      user:req.user,
      challengeData:challengeData
   })

   // TODO: if relsuts is empty results.row throws an error!
   // //get challenge_id from URL query string
   // const challenge_id = req.query.challengeid
   // const user_id = req.query.userid


   // // ORDER BY used to only show most recent challenge
   // pool.query(
   //    `SELECT * 
   //    FROM activity
   //       INNER JOIN ua_rel ON activity.aID = ua_rel.aID
   //       LEFT JOIN eingabe ON ua_rel.uar_ID = eingabe.uar_ID
   //    WHERE ua_rel.id=$1 AND activity.aID=$2
   //    ORDER BY date_end DESC`, [user_id, challenge_id], (err, results) => {
   //      if (err) {
   //        console.log(err);
   //      }   
   //    console.log(results.rows)
   //    res.render('challenge-view',
   //    {
   //       challenge:results.rows[0],
   //       user:req.user      
   //    })
   // })
})

// to load data for charts
router.get('/challenge-view/data', async (req, res) => {
   console.log("got data request for a challenge")
   const date1 = new Date("2020-09-09")
   const date2 = new Date("2020-09-11")
   const date3 = new Date("2020-09-12")
   const end = new Date("2020-09-16")
   const result = {  entries:[
                  {   
                     x: date1, // date of the entry
                     y: 1, // value of the entry - one day
                  }, 
                  {   
                     x: date2,
                     y: 1,
                  }, 
                  {   
                     x: date3,
                     y: 1,
                  } 
               ],
               progress: [
                  {
                     
                  }
               ],
               goal: {
                  endDate:end,
                  value: 4
               }, 
               user:req.user 
   }

   res.send(result)
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

// // show specific challenge 
// router.post('/dashboard', checkAuthenticated, (req, res)=>{
//    console.log("post income")
//    // TODO: take selected Challenge id from request
//    // redirect to specific challenge-view 
//    res.redirect('/challenge-view')
// })

// // go back to dashboard
// router.post('/challenge-overview', checkAuthenticated, (req, res)=>{
//    // redirect to dashboard 
//    res.redirect('/dashboard')
// })

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
                        RETURNING uid, password`,
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

      //read goal from request body
      let {challengeGoal} = req.body;

      console.log(challengeGoal)

      // convert from milliseconds to days
      challenge_duration *= 1000*60*60*24

      //verify that challenge hasn't already been accepted by the user
      pool.query(
         `SELECT uid, challenge.cid, date_end 
         FROM uc_rel INNER JOIN challenge on uc_rel.cid = challenge.cid
         WHERE uid=$1 AND challenge.cid=$2 AND date_end >= NOW()`, [user_id, challenge_id], (err, results) => {
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
                  `INSERT INTO uc_rel (uid, cid, goal) 
                     VALUES ($1, $2, $3)`,
                        [user_id, challenge_id, challengeGoal],
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


   // add new entry
   router.post('/challenge-view/entry', (req,res)=>{

      //read id's from url
      const user_id = req.query.userid
      const challenge_id = req.query.challengeid

      //read goal from request body
      let { date, entry } = req.body;

      console.log("new entry: date", date, "entry", entry)

      // add entry to the specified challenge
      // pool.query(

      // )
      res.redirect('/challenge-view')
   })

   // edit entry
   router.post('/challenge-view/data', (req,res)=>{

      //read id's from url
      const user_id = req.query.userid
      const challenge_id = req.query.challengeid

      //read goal from request body
      // let { date, entry } = req.body;

      console.log("edit entry: ", req.body)

      // add entry to the specified challenge
      // pool.query(

      // )
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