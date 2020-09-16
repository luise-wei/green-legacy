const { pool } = require('../dbConfig')

async function numSolvedChallenges(userId){
   try{
      const results = await pool.query(
         `SELECT COUNT(cid)
         FROM(
            SELECT DISTINCT challenge.cid
            FROM uc_rel
               INNER JOIN challenge on challenge.cid = uc_rel.cid
            WHERE uid = $1 AND date_end < NOW()
         ) as tempTbl`,
         [userId]
         );

         var count = results.rows[0].count
   
      return count;
   }
   catch(e){
      console.log(e)
      return [];
  }
}

// TODO!! 
async function savedCO2(userId){
}


async function favoriteChallenge(userId){
   try{
      const results = await pool.query(
         `SELECT activity.aid, aname, COUNT(uc_rel.cid)
         FROM uc_rel
            INNER JOIN challenge on uc_rel.cid = challenge.cid
            INNER JOIN activity on challenge.aid = activity.aid
         WHERE uc_rel.uid = $1
         GROUP BY activity.aid
         ORDER BY count DESC
         LIMIT 1;`,
         [userId]
         );
      return results.rows[0];
   }
   catch(e){
      console.log(e)
      return [];
  }
}

async function getCurrentChallenges(userId){
   try{
      const results = await pool.query(
         `SELECT ucr_id,uc_rel.uid,uc_rel.cid,goal,activity.aid,TO_CHAR(date_start, 'DD/MM/YYYY') as date_start,TO_CHAR(date_end, 'DD/MM/YYYY') as date_end,aname,unit,abfrage,icon,image,infotext,defaultgoal,mingoal,maxgoal,shortinfotext,savedco2perunit
         FROM uc_rel
         INNER JOIN challenge on uc_rel.cid = challenge.cid
         INNER JOIN activity on challenge.aid = activity.aid
         WHERE uc_rel.uid = $1 AND date_end >= NOW()`,
         [userId]
         );
      return results.rows;
   }
   catch(e){
      console.log(e)
      return [];
  }
}
async function getCompletedChallenges(userId){
   try{
      const results = await pool.query(
         `SELECT ucr_id,uc_rel.uid,uc_rel.cid,goal,activity.aid,TO_CHAR(date_start, 'DD/MM/YYYY') as date_start,TO_CHAR(date_end, 'DD/MM/YYYY') as date_end,aname,unit,abfrage,icon,image,infotext,defaultgoal,mingoal,maxgoal,shortinfotext,savedco2perunit
         FROM uc_rel
         INNER JOIN challenge on uc_rel.cid = challenge.cid
         INNER JOIN activity on challenge.aid = activity.aid
         WHERE uc_rel.uid = $1 AND date_end < NOW()`,
         [userId]
         );
      return results.rows;
   }
   catch(e){
      console.log(e)
      return [];
  }
}


module.exports = {numSolvedChallenges,favoriteChallenge,getCurrentChallenges,getCompletedChallenges}
