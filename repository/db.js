import pg from "pg"


async function connect() {
  if (global.connection) {
    return global.connection.connect()
  }
  const pool = new pg.Pool({
    connectionString: "postgres://ejowippb:ACDAaI6Sq6RCPy14tKtO0d4Di347maC0@isabelle.db.elephantsql.com/ejowippb"
  })
  global.connection = pool
  return pool.connect()
}



export {connect} 









