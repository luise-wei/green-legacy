const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const { pool } = require('../database/dbConfig')

const initializePassport = require("../passportConfig")

initializePassport(passport)

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
router.get('/login', async (req, res) => {
   res.render('login')
})

// show register page
router.get('/register', async (req, res) => {
   res.render('register')
})

// show user's dashboard with current and archived challenges
router.get('/dashboard', async (req, res) => {
   res.render('dashboard',{name:testname})
})

// show challenge overview -> load all possible challenges from the challenge collection
router.get('/challenge-overview', async (req, res) => {
   res.render('challenge-overview')
})

// show a specific challenge -> ranking, group members, etc.
// no matter if current or archived
// TODO: transfer username and challenge ID so the challenge can be loaded from the data base
router.get('/challenge-view', async (req, res) => {
   res.render('challenge-view',{name:testname})
})

// show invite page to share the challenge with friends
// TODO: when do we create a noe challenge in the data base
// 1) on 'accept challenge' in the challenge-overview page
// 2) on 'send invite' in the share-challenge page
router.get('/share-challenge', async (req, res) => {
   res.render('share-challenge')
})


// -----------------
// -- POST ROUTES --
// -----------------

//Register:
router.post("/register", async (req, res) => {
   let { name, email, password, passwordControl } = req.body;
 
   let errors = [];
 
   console.log({
     name,
     email,
     password,
     passwordControl
   });
 
   if (!name || !email || !password || !passwordControl) {
     errors.push({ message: "Please enter all fields" });
   }
 
   if (password.length < 6) {
     errors.push({ message: "Password must be a least 6 characters long" });
   }
 
   if (password !== passwordControl) {
     errors.push({ message: "Passwords do not match" });
   }
 
   if (errors.length > 0) {
      res.render("register", { errors, name, email, password, passwordControl });
    } else {
      hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      // Validation passed
      pool.query(
        `SELECT * FROM users
          WHERE email = $1`,
        [email],
        (err, results) => {
          if (err) {
            console.log(err);
          }
          console.log(results.rows);
  
          if (results.rows.length > 0) {
             errors.push({message: "Email already registered"})
             res.render("register",{ errors})
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
                  console.log(results.rows);
                  req.flash("success_msg", "You are now registered. Please log in");
                  res.redirect("/login");
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

   function checkAuthenticated(req,res,next){
      if (req.isAuthenticated()){
         return res.redirect('/dashboard')
      }
      next()
   }
   
   function checkNotAuthenticated(req,res,next){
      if (req.isAuthenticated()){
         return next()
      }
      
      res.redirect('/login')
   }

module.exports = router