require("dotenv").config()

const { Pool } = require("pg")

//is true if in production
const isProduction = process.env.NODE_ENV === 'production'

// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const connectionString = `postgresql://ltfetihm:$9qHL2JYVHVMby9GDa8QtcMatGf3pRc9O@balarama.db.elephantsql.com:5432/ltfetihm`

const pool = new Pool({
   connectionString: isProduction ? process.env.DB_DATABASE_URL : connectionString
})

module.exports = {pool}