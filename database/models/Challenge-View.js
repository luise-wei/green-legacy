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
      challengeData.daysleft++
   
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
         `SELECT SUM(savedco2) as sumSavedCo2
         FROM (
            SELECT (input*savedco2perunit) as savedco2
            FROM activity
               INNER JOIN challenge on activity.aid = challenge.aid
               INNER JOIN uc_rel on challenge.cid = uc_rel.cid
               INNER JOIN challengeInput on uc_rel.ucr_id = challengeInput.ucr_id
            WHERE uid = $1
            ) tempTbl`,
         [ucr_id]
         );
   
      return results.rows;
   }
   catch(e){
      console.log(e)
      return [];
  }
}

async function newChallengeInputEntry(ucr_id,input,dateStart,dateEnd){
   try{
      const results = await pool.query(
         `INSERT INTO challengeInput (ucr_id,input,e_date_start,e_date_end)
         VALUES ($1,$2,$3,$4)`,
         [ucr_id,input,dateStart,dateEnd]
         );
   }
   catch(e){
      console.log(e)
      return [];
  }
}

module.exports = {getChallengeInfoForChallengeView,getDataEntriesToChallenge,newChallengeInputEntry}