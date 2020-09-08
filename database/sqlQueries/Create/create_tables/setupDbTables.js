const { pool } = require('../../../dbConfig')
const fs = require('fs')

const dataSql = fs.readFileSync('challenge.sql').toString();

console.log(dataSql)

pool.query(
   'SELECT * FROM activity', (err, results) => {
     if (err) {
       console.log(err);
     }
   
   console.log(results)
    }
)