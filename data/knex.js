module.exports = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://localhost/names',
  debug: true
})
