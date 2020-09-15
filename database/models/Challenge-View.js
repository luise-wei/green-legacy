const { pool } = require('../dbConfig')

async function getChallengeInfoForChallengeView(ucr_id){
   try{
      const results = await pool.query(
         `SELECT uc_rel.ucr_id,uc_rel.uid,challenge.cid,goal,activity.aid,TO_CHAR(date_start, 'DD/MM/YYYY') as date_start,TO_CHAR(date_end, 'DD/MM/YYYY') as date_end,TO_CHAR(date_end - NOW(),'DD') as daysLeft,aname,unit,abfrage,icon,image,infotext,defaultgoal,mingoal,maxgoal,shortinfotext,savedco2perunit
         FROM uc_rel
            INNER JOIN challenge on uc_rel.cid = challenge.cid
            INNER JOIN activity on challenge.aid = activity.aid
         WHERE uc_rel.ucr_id = $1`,
         [ucr_id]
         );

      challengeData = results.rows[0]
      //trim leading 0 in daysLeft
      challengeData.daysleft = challengeData.daysleft.replace(/^0+/, '')

      console.log(challengeData)
   
      return challengeData;
   }
   catch(e){
      console.log(e)
      return [];
  }
}

async function getDataEntriesToChallenge(ucr_id){
   try{
      const results = await pool.query(
         `SELECT * 
         FROM eingabe 
            INNER JOIN uc_rel ON eingabe.ucr_id = uc_rel.ucr_id
            INNER JOIN challenge on uc_rel.cid = challenge.cid
            INNER JOIN activity on challenge.aid = activity.aid
         WHERE uc_rel.ucr_id = $1 AND date_end >= NOW()`,
         [ucr_id]
         );
   
      return results.rows;
   }
   catch(e){
      console.log(e)
      return [];
  }
}

module.exports = {getChallengeInfoForChallengeView,getDataEntriesToChallenge}