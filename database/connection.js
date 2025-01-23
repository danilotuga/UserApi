var knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'localhost',
      user : 'root',
      password : '12345',
      database : 'usertest'
    }
  });

module.exports = knex