const { pool } = require('../dbConfig')

async function getChallengesForChallengeOverview(){
   try{
      const results = await pool.query("SELECT * FROM activity");
      //console.log(results.rows)
      return results.rows;
   }
   catch(e){
      return [];
  }
}

module.exports = {getChallengesForChallengeOverview}


/* const { pool } = require('../dbConfig')

async function getChallengesForChallengeOverview(){
   pool.query(
      `SELECT * FROM activity`, (err, results) => {
         if (err) {
            console.log(err);
         }
      }
   )
   return await results.rows
}

function hello(){
   console.log("hello")
}

module.exports = { getChallengesForChallengeOverview, hello }
 */
