const express = require('express')
const router = express.Router()

const testname = 'Luise'

router.get('/', async (req, res) => {
   res.render('index',{name:testname})
})

module.exports = router