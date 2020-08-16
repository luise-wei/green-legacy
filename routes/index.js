const express = require('express')
const router = express.Router()

const testname = 'Luise'

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

module.exports = router