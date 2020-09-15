const { pool } = require('../dbConfig')

async function getChallengesForChallengeOverview(){
   try{
      const results = await pool.query(
         "SELECT cid,activity.aid,TO_CHAR(date_start, 'DD/MM/YYYY') as date_start,TO_CHAR(date_end, 'DD/MM/YYYY') as date_end,  aname,unit,abfrage,icon,image,infotext,defaultgoal,mingoal,maxgoal,shortinfotext FROM challenge INNER JOIN activity on activity.aid = challenge.aid"
         );
   
      results.rows.forEach(challenge => {
         var date = challenge.date_start
         var date2 = date.split('T')
         console.log(date2)
      })

      console.log(results.rows)
      
      /*
      results.rows.forEach(challenge => {
         const birthDate = challenge.date_start
         console.log(birthDate)

         const [year, month, day] = [...birthDate.split('-')]
         const monthIndex = month - 1 // remember that Date's contructor 2nd param is monthIndex (0-11) not month number (1-12)!
         const jsBirthDate = new Date(year, monthIndex, day)

         challenge.date_start = jsBirthDate
      })
      */

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
