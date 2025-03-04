const path = require('path')

module.exports = {
  client: 'mysql',
  connection: {
    database: process.env.DBNAME,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 10000
    
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.resolve(__dirname,'./migrations'),
  },
  seeds: {
    directory: path.resolve(__dirname,'./seeds'),
  },
}