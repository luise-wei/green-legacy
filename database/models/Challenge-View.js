const { pool } = require('../dbConfig')

async function getChallengesInfoForChallengeView(){
   try{
      const results = await pool.query(
         "SELECT cid,activity.aid,TO_CHAR(date_start, 'DD/MM/YYYY') as date_start,TO_CHAR(date_end, 'DD/MM/YYYY') as date_end,  aname,unit,abfrage,icon,image,infotext,defaultgoal,mingoal,maxgoal,shortinfotext FROM challenge INNER JOIN activity on activity.aid = challenge.aid"
         );
   
      return results.rows;
   }
   catch(e){
      console.log(e)
      return [];
  }
}

module.exports = {getChallengesInfoForChallengeView}