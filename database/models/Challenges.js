const { pool } = require('../dbConfig')

async function getChallengesForChallengeOverview(){
   try{
      const results = await pool.query(
         `SELECT cid,activity.aid,TO_CHAR(date_start, 'DD/MM/YYYY') as date_start,TO_CHAR(date_end, 'DD/MM/YYYY') as date_end,  aname,unit,abfrage,icon,image,infotext,defaultgoal,mingoal,maxgoal,shortinfotext 
         FROM challenge 
         INNER JOIN activity on activity.aid = challenge.aid`
         );
   
      return results.rows;
   }
   catch(e){
      console.log(e)
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
